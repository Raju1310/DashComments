from dash_echarts import DashECharts

def get_bar_chart():
    option = {
        "xAxis": {
            "type": "category",
            "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        "yAxis": {"type": "value"},
        "series": [
            {"data": [120, 200, 150, 80, 70, 110, 130], "type": "bar"},
        ],
    }
    return DashECharts(option=option, style={"height": "100%"})
