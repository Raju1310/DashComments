# ==============================================================================
# FILE: components/data_browser_tab.py
# PURPOSE: Data Browser tab — Infinite Scroll AG Grid + Celery Background Jobs
#
# ARCHITECTURE:
#   browser-load-trigger (Store)  ← ONLY Input to background callback
#        ↑
#   prepare_load_trigger()        ← regular fast callback, writes trigger
#        ↑ Inputs
#   browser-selected-tables (Store)
#
#   global-filtered-ids-store     ← State only, never Input
#   selected-study-number-...     ← State only, never Input
#
# CROSS-PROCESS DATA SHARING:
#   Celery worker writes (df + column_defs) → Redis (pickle)
#   Web server reads from Redis during AG Grid infinite scroll
#   In-memory dicts are NOT shared across processes — always use Redis
#
# PROCESSES:
#   Web server : gunicorn app:server
#   Worker     : celery -A celery_worker.celery_app worker
# ==============================================================================

import hashlib
import json
import pickle
import time as _time
from io import StringIO

import dash_ag_grid as dag
import numpy as np
import pandas as pd
from dash import ALL, MATCH, Input, Output, State, callback, ctx, dcc, html, no_update

from Utilities.genUtils import load_table_data
from cache_config import background_callback_manager, cache


# ==============================================================================
# CONSTANTS
# ==============================================================================

CACHE_TIMEOUT               = 300
SET_FILTER_UNIQUE_THRESHOLD = 200


# ==============================================================================
# SECTION 1: REDIS DataFrame STORAGE
# ==============================================================================

def _redis_key(study_number: str, table_name: str, subject_ids_json: str) -> str:
    subject_hash = hashlib.md5(subject_ids_json.encode()).hexdigest()[:8]
    return f"df_cache_{study_number}_{table_name}_{subject_hash}"


def _store_payload(key: str, df: pd.DataFrame, column_defs: list) -> None:
    try:
        cache.set(
            key,
            pickle.dumps({"df": df, "column_defs": column_defs}),
            timeout=CACHE_TIMEOUT,
        )
    except Exception:
        pass


def _load_payload(key: str) -> tuple[pd.DataFrame, list] | tuple[None, None]:
    try:
        raw = cache.get(key)
        if raw is None:
            return None, None
        payload = pickle.loads(raw)
        if not isinstance(payload, dict) or "column_defs" not in payload:
            return None, None
        return payload["df"], payload["column_defs"]
    except Exception:
        return None, None


# ==============================================================================
# SECTION 2: DATA UTILITIES
# ==============================================================================

def convert_to_serializable(value):
    try:
        if pd.isna(value):
            return None
    except (TypeError, ValueError):
        pass
    if isinstance(value, (np.integer, np.int64, np.int32)):
        return int(value)
    if isinstance(value, (np.floating, np.float64, np.float32)):
        return float(value)
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, pd.Timestamp):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    return value


def _build_column_defs(df: pd.DataFrame) -> list:
    nunique_counts = df.nunique()
    column_defs    = []
    for col in df.columns:
        n_unique = int(nunique_counts[col])
        if n_unique <= SET_FILTER_UNIQUE_THRESHOLD:
            unique_vals = df[col].apply(convert_to_serializable).dropna().unique().tolist()
            try:
                unique_vals = sorted(unique_vals, key=lambda x: (x is None, str(x)))
            except TypeError:
                pass
            column_defs.append({
                "field": col,
                "sortable": True,
                "resizable": True,
                "filter": "agSetColumnFilter",
                "filterParams": {
                    "values": unique_vals,
                    "buttons": ["reset", "apply"],
                    "suppressMiniFilter": n_unique <= 10,
                },
            })
        else:
            column_defs.append({
                "field": col,
                "sortable": True,
                "resizable": True,
                "filter": "agTextColumnFilter",
                "filterParams": {"buttons": ["reset", "apply"]},
            })
    return column_defs


def _apply_sort_filter(df: pd.DataFrame, request: dict) -> pd.DataFrame:
    dff          = df
    filter_model = (request or {}).get("filterModel") or {}

    if filter_model:
        for col, fdef in filter_model.items():
            if col not in dff.columns:
                continue
            filter_type    = fdef.get("filterType", "")
            condition_type = fdef.get("type", "")
            fval           = fdef.get("filter")

            if filter_type == "set":
                selected = fdef.get("values")
                if selected is None:
                    continue
                dff = dff[dff[col].apply(convert_to_serializable).isin(selected)]
                continue

            if filter_type == "text" or condition_type in {
                "contains", "notContains", "equals", "notEqual", "startsWith", "endsWith",
            }:
                s = dff[col].astype(str)
                if condition_type == "contains":
                    dff = dff[s.str.contains(str(fval), case=False, na=False)]
                elif condition_type == "notContains":
                    dff = dff[~s.str.contains(str(fval), case=False, na=False)]
                elif condition_type == "equals":
                    dff = dff[s == str(fval)]
                elif condition_type == "notEqual":
                    dff = dff[s != str(fval)]
                elif condition_type == "startsWith":
                    dff = dff[s.str.startswith(str(fval), na=False)]
                elif condition_type == "endsWith":
                    dff = dff[s.str.endswith(str(fval), na=False)]
                continue

            if filter_type == "number" or condition_type in {
                "greaterThan", "lessThan", "greaterThanOrEqual", "lessThanOrEqual",
            }:
                series = pd.to_numeric(dff[col], errors="coerce")
                try:
                    num = float(fval)
                except (TypeError, ValueError):
                    continue
                if condition_type == "greaterThan":
                    dff = dff[series > num]
                elif condition_type == "lessThan":
                    dff = dff[series < num]
                elif condition_type == "greaterThanOrEqual":
                    dff = dff[series >= num]
                elif condition_type == "lessThanOrEqual":
                    dff = dff[series <= num]

    sort_model = (request or {}).get("sortModel") or []
    if sort_model:
        cols = [s["colId"] for s in sort_model if s.get("colId") in dff.columns]
        if cols:
            asc = [s.get("sort") == "asc" for s in sort_model if s.get("colId") in dff.columns]
            dff = dff.sort_values(by=cols, ascending=asc, kind="mergesort")

    return dff


# ==============================================================================
# SECTION 3: DATA LOADING
# ==============================================================================

@cache.memoize(timeout=CACHE_TIMEOUT)
def get_data_browser_mapping_cached(study_number: str) -> str:
    empty = pd.DataFrame(columns=["table_name", "display_name"]).to_json(orient="split")
    try:
        if not study_number:
            return empty
        df = load_table_data(study_number, "data_browser_mapping")
        if df is None or df.empty:
            return empty
        if not all(c in df.columns for c in ["table_name", "display_name"]):
            return empty
        return df[["table_name", "display_name"]].dropna().to_json(orient="split")
    except Exception:
        return empty


def load_mapping_df(study_number: str) -> pd.DataFrame:
    try:
        return pd.read_json(
            StringIO(get_data_browser_mapping_cached(study_number)), orient="split"
        )
    except Exception:
        return pd.DataFrame(columns=["table_name", "display_name"])


def get_table_data_for_infinite_scroll(
    study_number: str,
    table_name: str,
    subject_ids_json: str,
) -> tuple:
    try:
        if not study_number or not table_name:
            return None, 0, []

        subject_ids = json.loads(subject_ids_json) if subject_ids_json else []
        if not subject_ids:
            return None, 0, []

        key = _redis_key(study_number, table_name, subject_ids_json)

        df, column_defs = _load_payload(key)
        if df is not None:
            return key, len(df), column_defs

        df = load_table_data(study_number, table_name)
        if df is None or df.empty:
            return None, 0, []

        subject_col = next(
            (c for c in [
                "Subject Identifier for the Study",
                "Subject Identifier",
                "SUBJID",
                "subject",
                "Subject",
            ] if c in df.columns),
            None,
        )
        if subject_col:
            df[subject_col] = df[subject_col].astype(str).str.strip()
            subject_ids_str = [str(x).strip() for x in subject_ids]
            df = df[df[subject_col].isin(subject_ids_str)]

        column_defs = _build_column_defs(df)
        _store_payload(key, df, column_defs)

        return key, len(df), column_defs

    except Exception:
        return None, 0, []


# ==============================================================================
# SECTION 4: LAYOUT
# ==============================================================================

def _empty_state(title: str, message: str, icon: str = "search--v1") -> html.Div:
    return html.Div(
        [
            html.Img(
                src=f"https://img.icons8.com/ios/100/cccccc/{icon}.png",
                style={"marginBottom": "20px"},
            ),
            html.H3(title, style={"color": "#aaa"}),
            html.P(message, style={"color": "#bbb"}),
        ],
        style={
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center",
            "justifyContent": "center",
            "height": "100%",
        },
    )


def render_data_browser_tab(subject_ids=None):
    subject_ids_json = json.dumps(subject_ids) if subject_ids is not None else None

    return html.Div(
        style={"display": "flex", "width": "100%", "height": "100%", "fontFamily": "sans-serif"},
        children=[

            # ── Stores ───────────────────────────────────────────────────────
            dcc.Store(id="browser-subject-ids", data=subject_ids_json),
            # REMOVED data=[] to allow persistence from session
            dcc.Store(id="browser-selected-tables", storage_type="session"),
            dcc.Store(id="browser-table-metadata", storage_type="memory"),
            dcc.Store(id="browser-load-trigger", storage_type="memory"),

            # ── Sidebar ──────────────────────────────────────────────────────
            html.Div(
                style={
                    "width": "20%", "height": "100%", "backgroundColor": "#FFFFFF",
                    "borderRight": "1px solid #E0E0E0", "padding": "15px",
                    "display": "flex", "flexDirection": "column", "overflowY": "hidden",
                },
                children=[
                    html.H4(
                        id="browser-table-count-header",
                        children="Details : 0",
                        style={
                            "marginTop": "0", "marginBottom": "15px",
                            "color": "#333", "fontSize": "16px", "fontWeight": "bold",
                        },
                    ),
                    dcc.Input(
                        id="browser-search-input",
                        type="text",
                        placeholder="Search the Table...",
                        persistence=True,
                        persistence_type="session",
                        style={
                            "width": "100%", "padding": "8px 12px", "borderRadius": "4px",
                            "border": "1px solid #ddd", "marginBottom": "15px", "fontSize": "14px",
                        },
                    ),
                    html.Div(
                        id="browser-buttons-container",
                        style={"flex": "1", "overflowY": "auto", "paddingRight": "5px"},
                        children=[],
                    ),
                ],
            ),

            # ── Content Area ─────────────────────────────────────────────────
            html.Div(
                style={
                    "width": "80%", "height": "100%", "backgroundColor": "#F4F6F8",
                    "padding": "20px", "overflowY": "auto",
                    "display": "flex", "flexDirection": "column", "gap": "20px",
                },
                children=[

                    # Progress bar — static IDs required by background callback
                    html.Div(
                        id="browser-progress-wrapper",
                        style={"display": "none"},
                        children=[
                            html.Div(
                                style={
                                    "display": "flex", "alignItems": "center",
                                    "gap": "12px", "marginBottom": "6px",
                                },
                                children=[
                                    html.Span(
                                        id="browser-progress-label",
                                        children="",
                                        style={
                                            "fontSize": "13px",
                                            "color": "#555",
                                            "fontWeight": "500",
                                        },
                                    ),
                                    html.Button(
                                        "✕ Cancel",
                                        id="browser-cancel-btn",
                                        n_clicks=0,
                                        disabled=True,
                                        style={
                                            "fontSize": "12px", "padding": "3px 10px",
                                            "borderRadius": "4px", "border": "1px solid #ccc",
                                            "cursor": "pointer", "backgroundColor": "#fff",
                                        },
                                    ),
                                ],
                            ),
                            html.Progress(
                                id="browser-progress-bar",
                                value="0",
                                max="100",
                                style={
                                    "width": "100%", "height": "8px",
                                    "accentColor": "#8A2ECC",
                                },
                            ),
                        ],
                    ),

                    html.Div(
                        id="browser-content-area",
                        children=[
                            _empty_state(
                                "No Tables Selected",
                                "Select a table from the left to view details.",
                            )
                        ],
                    ),
                ],
            ),
        ],
    )


def generate_sidebar_buttons(
    mapping_df: pd.DataFrame,
    filter_text: str = "",
    selected_tables: list = None,
) -> list:
    if selected_tables is None:
        selected_tables = []
    if mapping_df is None or mapping_df.empty:
        return [html.Div("No tables available",
                         style={"color": "#888", "fontStyle": "italic", "padding": "10px"})]

    selected_tables = [str(t) for t in selected_tables]
    buttons         = []

    for _, row in mapping_df.iterrows():
        display_name = row.get("display_name", "")
        table_name   = str(row.get("table_name", ""))
        if not display_name or not table_name:
            continue
        if filter_text and filter_text.lower() not in display_name.lower():
            continue
        is_active = table_name in selected_tables
        buttons.append(
            html.Div(
                display_name,
                id={"type": "browser-table-btn", "table": table_name},
                n_clicks=0,
                style={
                    "width": "100%", "textAlign": "center", "padding": "10px",
                    "marginBottom": "10px", "borderRadius": "6px", "cursor": "pointer",
                    "border": "2px solid #8A2ECC" if is_active else "1px solid #E0E0E0",
                    "backgroundColor": "#8A2ECC" if is_active else "#FFFFFF",
                    "color": "#FFFFFF" if is_active else "#8A2ECC",
                    "fontWeight": "600", "fontSize": "13px", "transition": "all 0.2s ease",
                    "boxShadow": (
                        "0 2px 4px rgba(138,46,204,0.3)" if is_active
                        else "0 1px 3px rgba(0,0,0,0.1)"
                    ),
                },
            )
        )

    if not buttons:
        return [html.Div("No matching tables found",
                         style={"color": "#888", "fontStyle": "italic", "padding": "10px"})]
    return buttons


def render_ag_grid_table(
    table_name: str,
    display_name: str,
    total_rows: int,
    column_defs: list,
) -> html.Div:
    header = html.Div(
        style={
            "padding": "10px 15px", "display": "flex",
            "justifyContent": "space-between", "alignItems": "center",
        },
        children=[
            html.Span(display_name, style={"fontWeight": "bold", "fontSize": "15px"}),
            html.Div(
                "✕",
                id={"type": "browser-table-close", "table": table_name},
                n_clicks=0,
                style={
                    "cursor": "pointer", "fontSize": "14px",
                    "fontWeight": "bold", "padding": "4px 8px", "borderRadius": "4px",
                },
            ),
        ],
    )

    body = (
        html.Div(
            style={
                "padding": "20px", "textAlign": "center", "color": "#888",
                "fontStyle": "italic", "backgroundColor": "#f9f9f9",
                "border": "1px dashed #ddd", "borderRadius": "4px", "margin": "10px",
            },
            children=[html.Div(
                "No data available for the selected subjects in this table.",
                style={"fontSize": "14px"},
            )],
        )
        if total_rows == 0
        else html.Div(
            style={"padding": "0"},
            children=dag.AgGrid(
                id={"type": "browser-data-grid", "table": table_name},
                columnDefs=column_defs,
                defaultColDef={
                    "flex": 1, "minWidth": 120, "resizable": True, "sortable": True,
                },
                rowModelType="infinite",
                dashGridOptions={
                    "rowBuffer": 20,
                    "maxBlocksInCache": 5,
                    "cacheBlockSize": 100,
                    "pagination": True,
                },
                className="ag-theme-alpine custom-ag-grid",
                enableEnterpriseModules=True,
                style={"height": "40vmin", "width": "100%"},
            ),
        )
    )

    return html.Div(
        style={
            "backgroundColor": "#FFF", "borderRadius": "4px",
            "boxShadow": "0 1px 4px rgba(0,0,0,0.1)", "marginBottom": "20px",
            "overflow": "hidden", "flexShrink": 0, "minHeight": "min-content",
        },
        children=[header, body],
    )


# ==============================================================================
# SECTION 5: CALLBACKS
# ==============================================================================

@callback(
    Output("browser-buttons-container", "children"),
    Output("browser-table-count-header", "children"),
    Input("browser-search-input", "value"),
    Input("browser-selected-tables", "data"),
    Input("selected-study-number-to-access-across-app", "data"),
    prevent_initial_call=False,
)
def update_sidebar_buttons(search_term, selected_tables, study_number):
    if selected_tables is None:
        selected_tables = []
    if not study_number:
        return (
            [html.Div("Please select a study to view tables",
                      style={"color": "#888", "fontStyle": "italic", "padding": "10px"})],
            "Details : 0",
        )
    mapping_df = load_mapping_df(study_number)
    if mapping_df.empty:
        return (
            [html.Div("No tables configured for this study",
                      style={"color": "#888", "fontStyle": "italic", "padding": "10px"})],
            "Details : 0",
        )
    return (
        generate_sidebar_buttons(mapping_df, search_term or "", selected_tables),
        f"Details : {len(mapping_df)}",
    )




@callback(
    Output("browser-selected-tables", "data"),
    Input({"type": "browser-table-btn",   "table": ALL}, "n_clicks"),
    Input({"type": "browser-table-close", "table": ALL}, "n_clicks"),
    State("browser-selected-tables", "data"),
    prevent_initial_call=True,
)
def manage_table_selection(btn_clicks, close_clicks, current_selection):
    trigger = ctx.triggered_id
    if not trigger:
        return no_update

    current_selection = current_selection or []
    trigger_type      = trigger.get("type")
    trigger_table     = str(trigger["table"])

    if trigger_type == "browser-table-btn":
        if not btn_clicks or not any(c > 0 for c in btn_clicks):
            return no_update
    elif trigger_type == "browser-table-close":
        if not close_clicks or not any(c > 0 for c in close_clicks):
            return no_update

    new_selection = current_selection.copy()
    if trigger_type == "browser-table-btn":
        if trigger_table in new_selection:
            new_selection.remove(trigger_table)
        else:
            new_selection.append(trigger_table)
    elif trigger_type == "browser-table-close":
        if trigger_table in new_selection:
            new_selection.remove(trigger_table)

    return new_selection

@callback(
    Output("browser-content-area", "children", allow_duplicate=True),
    Output("browser-table-metadata", "data", allow_duplicate=True),
    Output("browser-cancel-btn", "n_clicks"),
    Input("browser-selected-tables", "data"),
    State("browser-cancel-btn", "n_clicks"),
    prevent_initial_call=True,
)
def clear_content_on_empty_selection(selected_tables, current_n_clicks):
    if not selected_tables or len(selected_tables) == 0:
        return (
            _empty_state("No Tables Selected", "Select a table from the left to view details."),
            {},
            (current_n_clicks or 0) + 1,
        )
    return no_update, no_update, no_update


@callback(
    Output("browser-load-trigger", "data"),
    Input("browser-selected-tables", "data"),
    Input("global-filtered-ids-store", "data"),
    State("browser-subject-ids", "data"),
    Input("selected-study-number-to-access-across-app", "data"),
    prevent_initial_call=True,
)
def prepare_load_trigger(selected_tables, global_filtered_ids, subject_ids_json, study_number):
    if not selected_tables or len(selected_tables) == 0 or not study_number:
        return no_update

    target_ids = []
    if global_filtered_ids:
        target_ids = global_filtered_ids
    elif subject_ids_json:
        try:
            target_ids = json.loads(subject_ids_json)
        except Exception:
            return no_update

    if not target_ids:
        return no_update

    payload = {
        "tables":   selected_tables,
        "ids_json": json.dumps(target_ids),
        "study":    study_number,
        "ts":       _time.time(),
    }
    return payload

@callback(
    Output("browser-content-area", "children"),
    Output("browser-table-metadata", "data"),

    Input("browser-load-trigger", "data"),

    background=True,
    manager=background_callback_manager,

    running=[
        (Output("browser-progress-wrapper", "style"), {"display": "block"}, {"display": "none"}),
        (Output("browser-cancel-btn", "disabled"), False, True),
    ],

    cancel=[Input("browser-cancel-btn", "n_clicks")],

    progress=[
        Output("browser-progress-bar", "value"),
        Output("browser-progress-label", "children"),
    ],
    progress_default=["0", ""],

    prevent_initial_call=True,
)
def update_content_area(set_progress, trigger_data):
    if not trigger_data:
        set_progress(["0", ""])
        return no_update, no_update

    selected_tables = trigger_data.get("tables", [])
    final_ids_json  = trigger_data.get("ids_json", "[]")
    study_number    = trigger_data.get("study", "")

    if not selected_tables or not study_number:
        set_progress(["0", ""])
        return _empty_state("No Tables Selected",
                            "Select a table from the left to view details."), {}

    mapping_df = load_mapping_df(study_number)
    if mapping_df.empty:
        set_progress(["0", ""])
        return html.Div("No table configuration found for this study.",
                        style={"color": "red", "padding": "20px"}), {}

    total    = len(selected_tables)
    children = []
    metadata = {}

    for idx, table_name in enumerate(selected_tables):
        set_progress([
            str(int((idx / total) * 100)),
            f"Loading {idx + 1} of {total}: {table_name}",
        ])

        row = mapping_df[mapping_df["table_name"] == table_name]
        if row.empty:
            continue

        display_name              = row.iloc[0]["display_name"]
        key, total_rows, col_defs = get_table_data_for_infinite_scroll(
            study_number, table_name, final_ids_json
        )

        metadata[str(table_name)] = {"cache_key": key, "total_rows": total_rows}
        children.append(render_ag_grid_table(table_name, display_name, total_rows, col_defs))

    set_progress(["100", f"Done — {len(children)} table(s) loaded"])

    if not children:
        return _empty_state("No Data Available",
                            "The selected tables have no data for the chosen subjects.",
                            icon="database--v1"), {}

    return children, metadata


@callback(
    Output({"type": "browser-data-grid", "table": MATCH}, "getRowsResponse"),
    Input({"type": "browser-data-grid", "table": MATCH}, "getRowsRequest"),
    State("browser-table-metadata", "data"),
    prevent_initial_call=True,
)
def handle_infinite_scroll_one_grid(request, table_metadata):
    if request is None:
        return no_update

    trigger    = ctx.triggered_id or {}
    table_name = str(trigger.get("table")) if isinstance(trigger, dict) else None
    if not table_name:
        return no_update

    redis_key = ((table_metadata or {}).get(table_name) or {}).get("cache_key")
    if not redis_key:
        return {"rowData": [], "rowCount": 0}

    df, _ = _load_payload(redis_key)
    if df is None:
        return {"rowData": [], "rowCount": 0}

    dff       = _apply_sort_filter(df, request)
    start_row = int(request.get("startRow", 0))
    end_row   = int(request.get("endRow", start_row + 100))
    partial   = dff.iloc[start_row:end_row]

    return {
        "rowData": [
            {k: convert_to_serializable(v) for k, v in r.to_dict().items()}
            for _, r in partial.iterrows()
        ],
        "rowCount": int(len(dff)),
    }
