import dash
from dash import html, dcc, callback, Input, Output, State
import dash_bootstrap_components as dbc
from components.bar_chart import get_bar_chart
from components.line_chart import get_line_chart
from components.scatter_chart import get_scatter_chart
import json

dash.register_page(__name__, path='/summary-builder')

# --- Helper Functions ---

def get_chart_component(chart_type):
    """Returns the chart component based on its type string."""
    chart_map = {
        'bar_chart': get_bar_chart(),
        'line_chart': get_line_chart(),
        'scatter_chart': get_scatter_chart()
    }
    return chart_map.get(chart_type)

# --- Reusable Components for the Sidebar ---

def build_layout_selector():
    """Builds the layout selector component."""
    layouts = {'2x2': 4, '3x1': 3, '1+2': 3, '2+1': 3, '1x1': 1, '1x2': 2}
    return html.Div([
        html.H5("Select a Layout"),
        html.Div(
            [dbc.Button(name, id={'type': 'layout-button', 'index': name}, color="light", className="m-1") for name in layouts],
            className="d-flex flex-wrap layout-selector"
        )
    ])

def build_visuals_selector():
    """Builds the visuals selector component with draggable charts."""
    charts = {
        "Subject": [("Chart 1", "bar_chart"), ("Chart 2", "line_chart")],
        "Subject Disposition": [("Chart 1", "scatter_chart")]
    }

    accordion_items = []
    for section, chart_list in charts.items():
        chart_divs = []
        for chart_name, chart_id in chart_list:
            chart_divs.append(
                html.Div([
                    html.Div(chart_name, className="chart-preview-title"),
                    get_chart_component(chart_id),
                ], id=f'drag-{chart_id}', draggable='true', className="draggable-chart")
            )
        accordion_items.append(dbc.AccordionItem(chart_divs, title=section))

    return html.Div([
        html.H5("Select Visuals", className="mt-4"),
        dbc.Accordion(accordion_items, start_collapsed=True, always_open=True)
    ])

# --- Main Page Layout ---

sidebar = dbc.Col([
    build_layout_selector(),
    build_visuals_selector()
], width=3, className="sidebar")

canvas = dbc.Col([
    dbc.Row([
        dbc.Col(html.H4("<- Create your own Layout"), width="auto"),
        dbc.Col([
            dbc.Button("Reset", id="reset-button", color="secondary", className="me-2"),
            dbc.Button("Save", color="primary", id="save-button"),
        ], width="auto", className="ms-auto")
    ], align="center", className="canvas-header"),
    html.Div(id="canvas-drop-area", className="canvas-grid")
], width=9, className="canvas-container")

layout = html.Div([
    dcc.Store(id='session-state-store'),
    dcc.Store(id='saved-state-store', storage_type='local'),
    dcc.Store(id='drop-data-store'),
    dbc.Container([
        dbc.Row([sidebar, canvas], style={"height": "100vh"})
    ], fluid=True),
])

# --- Callbacks ---

@callback(
    Output('session-state-store', 'data', allow_duplicate=True),
    Input('saved-state-store', 'data'),
    prevent_initial_call=False
)
def load_saved_state(saved_data):
    """On page load, copy the saved state into the session state."""
    if saved_data is None:
        return [None] * 4 # Default to 2x2 layout
    return saved_data

@callback(
    Output('saved-state-store', 'data'),
    Input('save-button', 'n_clicks'),
    State('session-state-store', 'data'),
    prevent_initial_call=True
)
def save_session_state(n_clicks, session_data):
    """On save, copy the session state into the saved state store."""
    return session_data

@callback(
    Output('session-state-store', 'data'),
    Output('canvas-drop-area', 'style'),
    Input({'type': 'layout-button', 'index': dash.ALL}, 'n_clicks'),
    prevent_initial_call=True
)
def update_layout_and_clear_canvas(n_clicks):
    """Updates the grid layout style and resets the canvas state."""
    ctx = dash.callback_context
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    layout_id = json.loads(button_id)['index']

    layout_config = {
        '2x2': (4, {"gridTemplateColumns": "1fr 1fr", "gridTemplateRows": "1fr 1fr"}),
        '3x1': (3, {"gridTemplateColumns": "1fr 1fr 1fr", "gridTemplateRows": "1fr"}),
        '1+2': (3, {"gridTemplateColumns": "1fr 1fr", "gridTemplateRows": "1fr 1fr", "gridTemplateAreas": '"a a" "b c"'}),
        '2+1': (3, {"gridTemplateColumns": "1fr 1fr", "gridTemplateRows": "1fr 1fr", "gridTemplateAreas": '"a b" "c c"'}),
        '1x1': (1, {"gridTemplateColumns": "1fr", "gridTemplateRows": "1fr"}),
        '1x2': (2, {"gridTemplateColumns": "1fr", "gridTemplateRows": "1fr 1fr"}),
    }

    num_cells, style = layout_config.get(layout_id, (4, {}))
    return [None] * num_cells, style

@callback(
    Output('session-state-store', 'data', allow_duplicate=True),
    Input('drop-data-store', 'data'),
    State('session-state-store', 'data'),
    prevent_initial_call=True
)
def on_drop_update_state(drop_data, current_state):
    """Updates the canvas state when a chart is dropped."""
    if not drop_data:
        return dash.no_update

    chart_id = drop_data['chartId'].replace('drag-', '')
    cell_index = drop_data['cellIndex']

    if current_state and 0 <= cell_index < len(current_state):
        current_state[cell_index] = chart_id
        return current_state

    return dash.no_update

@callback(
    Output('canvas-drop-area', 'children'),
    Input('session-state-store', 'data'),
)
def render_canvas_cells(canvas_data):
    """Renders the cells in the canvas based on the current state."""
    if not canvas_data:
        return [html.Div("Select a layout to begin", className="placeholder-text")]

    cells = []
    for i, chart_type in enumerate(canvas_data):
        content = get_chart_component(chart_type) if chart_type else html.Div(f"Drop here", className="drop-target-text")

        # Assign grid-area style for complex layouts
        grid_area = {}
        if len(canvas_data) == 3: # For 1+2 and 2+1 layouts
            areas = ['a', 'b', 'c']
            grid_area = {'gridArea': areas[i]}

        cells.append(
            html.Div(
                html.Div(content, className="chart-container") if chart_type else content,
                id={'type': 'drop-cell', 'index': i},
                className="drop-cell",
                **{'data-cell-index': i},
                style=grid_area
            )
        )
    return cells

@callback(
    Output('session-state-store', 'data', allow_duplicate=True),
    Input('reset-button', 'n_clicks'),
    State('session-state-store', 'data'),
    prevent_initial_call=True
)
def reset_canvas(n_clicks, current_state):
    """Resets the canvas to its default empty state."""
    if n_clicks and current_state is not None:
        return [None] * len(current_state)
    return dash.no_update
