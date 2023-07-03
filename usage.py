import dash_dataflow_components as ddc
from dash import Dash, html, Input, Output, callback

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
        nodes= [
              { "id": '1', "position": { "x": 0, "y": 0 }, "data": { "name": "test" }, "type": "db"},
              { "id": '2', "position": { "x": 0, "y": 100 }, "data": { }, "type": 'merge'},
              { "id": '3', "position": { "x": 0, "y": 200 }, "data": { }, "type": 'filter'},
              { "id": '4', "position": { "x": 0, "y": 300 }, "data": { }, "type": 'out'},
        ],
        edges = [
            { "id": 'e1-2', "source": '1', "target": '2', "animated": True },
            { "id": 'e2-3', "source": '2', "target": '3', "animated": True },
            { "id": 'e3-4', "source": '3', "target": '4', "animated": True }
            ]
        ),
    html.Div(id="node_out"),
    html.Div(id="edge_out"),
], style={"width": "600px", "height": "600px"})


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
