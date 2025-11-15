from dash_echarts import ECharts

def get_scatter_chart():
    option = {
        "xAxis": {},
        "yAxis": {},
        "series": [
            {
                "symbolSize": 20,
                "data": [
                    [10.0, 8.04], [8.0, 6.95], [13.0, 7.58], [9.0, 8.81], [11.0, 8.33],
                ],
                "type": "scatter",
            }
        ],
    }
    return ECharts(option=option, style={"height": "100%"})
