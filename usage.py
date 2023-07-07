import dash_dataflow_components as ddc
from dash import Dash, html, Input, Output, callback


import plotly.express as px
import datetime
import dash_express_components as dxc
dataframe = {}
dataframe["gapminder_extra_long"] = px.data.gapminder()
dataframe["gapminder_extra_long"]["time"] = datetime.datetime.now()
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
        meta = dataframe_meta
        ),
    html.Div(id="node_out"),
    html.Div(id="edge_out"),

    ddc.DataFlow(
        id='flow_2',
        nodes=[{'id': 'n2', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}, {'id': 'n1', 'type': 'merge', 'data': {'label': 'merge node'}}, {'id': 'out', 'type': 'out'}, {'id': 'n0', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}],
        edges= [{'source': 'n0', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i1'}, {'source': 'n1', 'target': 'out', 'sourceHandle': 'o', 'targetHandle': 'i'}, {'source': 'n2', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i2'}], 
        nodeTypes = ["db", "filter", "merge"],
        graphType = "singleOutput",
        meta = dataframe_meta
        ),
    html.Div(id="node_out_2"),
    html.Div(id="edge_out_2")
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


@callback(
    Output(component_id='node_out_2', component_property='children'),
    Input(component_id='flow_2', component_property='nodes')
)
def update_output_div(input_value):
    return f'Nodes: {input_value} <br/>'


@callback(
    Output(component_id='edge_out_2', component_property='children'),
    Input(component_id='flow_2', component_property='edges')
)
def update_output_div(input_value):
    return f'Edges: {input_value} <br/>'


if __name__ == '__main__':
    app.run_server(debug=True)
