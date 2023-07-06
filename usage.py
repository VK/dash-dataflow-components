import dash_dataflow_components as ddc
from dash import Dash, html, Input, Output, callback


import plotly.express as px
import datetime
import dash_express_components as dxc
dataframe = {}
dataframe["gapminder"] = px.data.gapminder()
dataframe["gapminder"]["time"] = datetime.datetime.now()
dataframe_meta = {
    k: dxc.get_meta(df) for k, df in dataframe.items()
}


app = Dash(
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
        
        {
    'href': 'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
    'rel': 'stylesheet',
    'integrity': 'sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf',
    'crossorigin': 'anonymous'
}
        
        ]
)

app.layout = html.Div([
    ddc.DataFlow(
        id='flow',
        nodes=  [{'id': 'n102', 'type': 'merge'}, {'id': 'n101', 'type': 'db'}, {'id': 'n100', 'type': 'db'}, {'id': '1', 'type': 'db'}, {'id': '2', 'type': 'merge'}, {'id': '3', 'type': 'filter'}, {'id': '4', 'type': 'out'}],
        edges = [{'source': '1', 'target': '2', 'sourceHandle': 'o', 'targetHandle': 'i1'}, {'source': 'n100', 'target': '2', 'sourceHandle': 'o', 'targetHandle': 'i2'}, {'source': '3', 'target': '4', 'sourceHandle': 'o', 'targetHandle': 'i'}, {'source': '2', 'target': 'n102', 'sourceHandle': 'o', 'targetHandle': 'i1'}, {'source': 'n101', 'target': 'n102', 'sourceHandle': 'o', 'targetHandle': 'i2'}, {'source': 'n102', 'target': '3', 'sourceHandle': 'o', 'targetHandle': 'i'}],
        meta = dataframe_meta
        ),
    html.Div(id="node_out"),
    html.Div(id="edge_out"),
], style={"width": "400px", "height": "400px"})


@callback(
    Output(component_id='node_out', component_property='children'),
    Input(component_id='flow', component_property='nodes')
)
def update_output_div(input_value):
    return f'Nodes: {input_value} <br/>'


@callback(
    Output(component_id='edge_out', component_property='children'),
    Input(component_id='flow', component_property='edges')
)
def update_output_div(input_value):
    return f'Edges: {input_value} <br/>'


if __name__ == '__main__':
    app.run_server(debug=True)
