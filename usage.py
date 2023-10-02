import dash_dataflow_components as ddc
import dash_express_components as dxc
from dash import Dash, html, Input, Output, State, callback, callback_context, dcc
from dash.exceptions import PreventUpdate


import plotly.express as px
import datetime
import dash_express_components as dxc
import plotly
import json
from flask import request

# initializing a test dataframe and the correspondig meta_data
dataframe = {}
dataframe["gapminder_extra_long"] = px.data.gapminder()
dataframe["gapminder_extra_long"]["time"] = datetime.datetime.now()
dataframe_meta = {
    k: dxc.get_meta(df) for k, df in dataframe.items()
}

# start configuration for the plot configurator
test_cfg = {
    "plot": {
        "type":"box",
        "params":{
            "x":"continent",
            "y":"lifeExp"
            }
    },
    "transform":[],
    "filter":[],
    "data_list":["gapminder_extra_long"],
    "parameterization":{
        "parameters":[],
        "computeAll":False,
        "computeMatrix":[]
        }
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

# Testlayout
app.layout = html.Div([ 
    html.Div([ 
        html.Div([
            ddc.DataFlow(
                id='dataflow',
                nodes=[{'id': 'n3', 'type': 'filter', 'data': {'config': [{'col': 'country', 'type': 'isin', 'value': ['Afghanistan']}]}}, {'id': 'n2', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}, {'id': 'n1', 'type': 'merge', 'data': {'left_on': ['country'], 'right_on': ['country'], 'left_p': 'A', 'right_p': 'B', 'how': 'inner'}}, {'id': 'out', 'type': 'out'}, {'id': 'n0', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}],
                edges=[{'source': 'n1', 'target': 'out', 'sourceHandle': 'o', 'targetHandle': 'i'}, {'source': 'n2', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i2'}, {'source': 'n0', 'target': 'n3', 'sourceHandle': 'o', 'targetHandle': 'i'}, {'source': 'n3', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i1'}], 
                # nodeTypes = ["db", "filter", "merge"],
                graphType="singleOutput",
                meta=dataframe_meta
                )
        ], style={"width": "100%", "height": "300px"}),
        html.Div(id="node_out"),
        html.Div(id="edge_out"),
        dxc.Configurator(id="plotConfig", meta={}, config={},
                                showFilter=False,
                                showTransform=False),
        dcc.Store(id="plot_storage"),
    ], style={"width": "500px", "float": "left"}),
    html.Div(

        [dxc.Graph(id="fig",
                   meta=dataframe_meta["gapminder_extra_long"],
                   defParams=test_cfg,
                   plotApi="plotApi",
                   style={"height": "100%", "width": "100%"}
                   )],

        style={"width": "calc(100% - 500px)", "height": "calc(100vh - 30px)",
               "display": "inline-block", "float": "left"}
    )

], className="p-4")


# callback for printing the nodes and egdes
@callback(
    Output(component_id='node_out', component_property='children'),
    Output(component_id='edge_out', component_property='children'),
    Input(component_id='dataflow', component_property='nodes'),
    Input(component_id='dataflow', component_property='edges'),
    prevent_initial_call=True
)
def update_output_div(input_node, input_edge):
    return f'Nodes: {input_node} <br/>', f'Edges: {input_edge} <br/>'


# callback for updating the plot configurator with the dataflow component
@callback(
    Output('plotConfig', 'meta'),
    Output('plotConfig', 'config'),
    Input('dataflow', 'nodes'),
    Input('dataflow', 'edges'),
    prevent_initial_call=True
)
def update_plotConfig_with_dataflow(nodes, edges):
    config = None
    meta = {}
    # generating outputs by calling the extract_datalow method with the nodes and edges
    outputs = ddc.extract_dataflow(nodes, edges, dataframe)
    print("output from dataflow:", outputs)
    # check if outputs is not empty
    if outputs is not None and len(outputs)!=0:
        for elem in outputs:
            if elem is not None and "df" in elem and elem["df"] is not None:
                # check if config is in elem of outputs  
                if "config" in elem and elem["config"] is not None:
                    config = elem["config"]
                    print("merge query plot:", elem["df"].query)
                # else extract meta out of the dataframe in the output elem
                else:
                    meta = dxc.get_meta(elem["df"])
                    print("merge query plot:", elem["df"].query)
        print("meta:", meta)
        print("config:", config)
        return meta, config
    return {}, None


# callback for storing a modified config
@callback(
    Output('plot_storage', 'data'),
    Input('plotConfig', 'config'),
    State('dataflow', 'nodes'),
    State('dataflow', 'edges'),
    prevent_initial_call=True
)
def handle_plot_data(all_config, nodes, edges):
    ctx = callback_context
    config = ctx.triggered[0]["value"]
    # store the name of the used dataframe and the nodes and edges in the config
    if config is not None:
        config["data_list"] = ["gapminder_extra_long"]
        config["nodes"] = nodes if nodes is not None else None
        config["edges"] = edges if edges is not None else None
    print("config test:", config)
    return config


# callback for creating a plot with the stored config
@callback(
    Output('fig', 'defParams'),
    Output('fig', 'meta'),
    Input('plot_storage', 'data'),
    prevent_initial_call=True
)
def handle_plot(config_data):
    config = {}
    new_meta = {}
    if config_data is not None and len(config_data)!=0:
        # initialize config with the config_data if config_data is not None
        if config_data is not None:
            config = config_data
        # call the extract_dataflow function if nodes and edges are in the config 
        if config_data is not None and "nodes" in config_data and "edges" in config_data:
            outputs = ddc.extract_dataflow(
                config_data["nodes"], config_data["edges"], dataframe)
            # search for the right dataframe for creating the meta data
            if outputs is not None and len(outputs)!=0:
                for out_map in outputs:
                    print("outmap:", out_map)
                    if out_map is not None and "df" in out_map and out_map["df"] is not None and "config" in out_map and out_map["config"] is not None:
                        print("first dict:", str(out_map["config"]["plot"]))
                        print("second dict:", str(config_data))
                        if str(out_map["config"]["plot"]) in str(config_data):
                            new_meta = dxc.get_meta(out_map["df"])
        # use the dataframe_meta dict if nodes and edges are not in config
        else:
            new_meta = dataframe_meta["gapminder_extra_long"]
        return config, new_meta
    
    raise PreventUpdate

@app.server.route("/plotApi", methods=['POST', 'GET'])
def plotApi():
    # create the plot for a merged dataframe created with the nodes and edges given to the params
    params = request.get_json()
    if request.method == 'POST':
        print("params:", params)
        # call the extract_dataflow function if nodes and edges are in the config 
        if "nodes" and "edges" in params and params["nodes"] is not None and params["edges"] is not None:
            outputs = ddc.extract_dataflow(params["nodes"], params["edges"], dataframe)
            if outputs is not None and len(outputs)!=0:
                df_plot = None
                df_out = None
                # search for the right dataframe for creating the meta data
                for out_map in outputs:
                    if out_map is not None and "df" in out_map and out_map["df"] is not None and "config" in out_map and out_map["config"] is not None:
                        if str(out_map["config"]["plot"]) in str(params):
                            df_plot = out_map["df"]
                    elif out_map is not None and "df" in out_map and out_map["df"] is not None:
                        df_out = out_map["df"]
                if df_plot is None and df_out is not None:      # TODO: Übernehmen in andere Dateien
                    df_plot = df_out
        # use the dataframe dict if nodes and edges are not in config
        else:
            df_plot = dataframe[params["data_list"][0]]
        print("merge query:", df_plot)
        fig = dxc.get_plot(df_plot, params, compute_types=["custom"])
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return {}


if __name__ == '__main__':
    app.run_server(debug=True)
