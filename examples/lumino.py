import dash_express_components as dxc
import dash_dataflow_components as ddc
import dash_lumino_components as dlc
import dash_bootstrap_components as dbc

from dash import Dash, html, Input, Output, State, callback, callback_context, dcc

import plotly.express as px
import datetime
from dash.exceptions import PreventUpdate
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

# start configuration for the plot configurator
dummy_cfg = {
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


app.layout = html.Div([
    dlc.BoxPanel([
        dlc.SplitPanel([
            # tab panel on the left side
            dlc.TabPanel([
                dcc.Store(id='plot_storage'),
                dlc.Panel([
                    # scroll div
                    html.Div([
                        # accordion header for Merger
                        html.H2([
                            dbc.Button(
                                "Merger", id="col_merg_button", className="accordion-button collapsed")
                        ], className="accordion-header", style={"border": "1px  #dfdfdf solid", "marginBottom": "-1px"}),
                        # collapse object for accordion
                        dbc.Collapse([
                            # accordion body for Merger
                            html.Div([
                                # div for the layout of the dataflow component
                                html.Div([
                                    ddc.DataFlow(id="dataflow", 
                                                 meta={}, nodeTypes=[
                                         "db", "filter", "merge", "trafo", "plot"], graphType="singleOutput")
                                ], style={"width": "100%", "height": "200px"}),
                                html.Div(id="node_out"),
                                html.Div(id="edge_out"),

                            ], className="accordion-body"),
                        ], id="col_merg", is_open=False, className="accordion-collapse"),


                        # merge plot configurator
                        dxc.Configurator(
                            id="plotConfig",
                            meta={},
                            config={},
                            showFilter=False,
                            showTransform=False
                        )
                    ], id="dummydfid", className='w-100 p-2 scroll-div'),
                ], id="merger", label="merge data")
            ],
                id='tab-panel-left',
                tabPlacement="left",
                allowDeselect=True,
                currentIndex=2,
                width=500
            ),
            # panel for the graph outputs
            dlc.DockPanel([
                # widget for the plots
                dlc.Widget(
                    # output plotter
                    dxc.Graph(id="fig",
                          meta=dataframe_meta['gapminder_extra_long'],
                          defParams=dummy_cfg,
                          plotApi="plotApi",
                          style={"height": "100%", "width": "100%"}
                              ),
                    id="graphwidget",
                    title="Graph"
                )
            ], id="dock-panel")
        ], id="split-panel")
    ], id="box-panel", addToDom=True),
], id="main")



# callback to fill the initial state
@callback(
    Output(component_id='dataflow', component_property='meta'),
    Output(component_id='dataflow', component_property='nodes'),
    Output(component_id='dataflow', component_property='edges'),    
    Input(component_id='main', component_property='className'),
    prevent_initial_call=False
)
def update_output_div(_):
    nodes=[{'id': 'n3', 'type': 'filter', 'data': {'config': [{'col': 'country', 'type': 'isin', 'value': ['Afghanistan']}]}}, {'id': 'n2', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}, {'id': 'n1', 'type': 'merge', 'data': {'left_on': ['country'], 'right_on': ['country'], 'left_p': 'A', 'right_p': 'B', 'how': 'inner'}}, {'id': 'out', 'type': 'out'}, {'id': 'n0', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}],
    edges=[{'source': 'n1', 'target': 'out', 'sourceHandle': 'o', 'targetHandle': 'i'}, {'source': 'n2', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i2'}, {'source': 'n0', 'target': 'n3', 'sourceHandle': 'o', 'targetHandle': 'i'}, {'source': 'n3', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i1'}], 
    
    return dataframe_meta, nodes, edges

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


# callback for the collapse of the Merger accordion
@callback(
    Output("col_merg", "is_open"),
    Input("col_merg_button", "n_clicks"),
    State("col_merg", "is_open"),
    prevent_initial_call=True
)
def toggle_collapse_merg(n, is_open):
    if n:
        return not is_open
    return is_open


# callback for the style of the Merger accordion header
@callback(
    Output('col_merg_button', 'className'),
    Input('col_merg_button', 'n_clicks'),
    State('col_merg_button', 'className'),
    prevent_initial_call=True
)
def change_style_merg(n_clicks, className):
    if 'collapsed' in className:
        return 'accordion-button'
    else:
        return 'accordion-button collapsed'


# callback for creating meta data and plots in the Merger accordion
@callback(
    Output('plotConfig', 'meta'),
    Output('plotConfig', 'config'),
    Input('dataflow', 'nodes'),
    Input('dataflow', 'edges'),
    prevent_initial_call=True
)
def update_merge_meta(nodes, edges):
    config = []
    meta = {}
    # generating outputs by calling the extract_datalow method with the nodes and edges
    outputs = ddc.extract_dataflow(nodes, edges, dataframe)
    # check if outputs is not empty
    if outputs is not None and len(outputs)!=0:
        for elem in outputs:
            if elem is not None and "df" in elem and elem["df"] is not None:
                # check if config is in elem of outputs  
                if "config" in elem and elem["config"] is not None:
                    config.append(elem["config"])
                # else extract meta out of the dataframe in the output elem
                else:
                    meta = dxc.get_meta(elem["df"])
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
    config_mod = []
    if not isinstance(config, list):
        config = [config]
    # store the name of the used dataframe and the nodes and edges in the config
    for config_elem in config:
        if config_elem is not None:
            config_elem["data_list"] = ["gapminder_extra_long"]
            config_elem["nodes"] = nodes if nodes is not None else None
            config_elem["edges"] = edges if edges is not None else None
            config_mod.append({"config": config_elem})
    return config_mod

# callback for creating a widget in the dock-panel with the stored config
@callback(
    Output('dock-panel', 'children'),
    Input('plot_storage', 'data'),
    State('dock-panel', 'children'),
    prevent_initial_call=True
)
def handle_widget(config_data, widgets):
    if config_data is not None and len(config_data)!=0:
        for plot_data in config_data:
            if not (plot_data is not None and "config" in plot_data and plot_data["config"] is not None):
                return widgets

            if "prevent_update" in plot_data["config"]["plot"] and plot_data["config"]["plot"]["prevent_update"]:
                raise PreventUpdate

            print("config:", plot_data["config"])
            print("widgets:", widgets)
            # remove all closed widgets
            widgets = [w for w in widgets if not (
                "props" in w and "deleted" in w["props"] and w["props"]["deleted"])]
            idnum = len(widgets)+1
            # create meta data for new widget
            if "nodes" in plot_data["config"] and "edges" in plot_data["config"]:
                outputs = ddc.extract_dataflow(
                    plot_data["config"]["nodes"], plot_data["config"]["edges"], dataframe)
                # search for the right dataframe for creating the meta data
                if outputs is not None and len(outputs)!=0:
                    df_plot = None
                    df_out = None
                    for out_map in outputs:
                        if out_map is not None and "df" in out_map and out_map["df"] is not None and "config" in out_map and out_map["config"] is not None:
                            print("first dict:", str(out_map["config"]["plot"]))
                            print("second dict:", str(plot_data))
                            if str(out_map["config"]["plot"]) in str(plot_data):
                                df_plot = out_map["df"]
                        elif out_map is not None and "df" in out_map and out_map["df"] is not None:
                            df_out = out_map["df"]
                    if df_plot is None and df_out is not None:
                        df_plot = df_out
                    new_meta = dxc.get_meta(df_plot)
            # use the dataframe_meta dict if nodes and edges are not in config
            else:
                new_meta = dataframe_meta['gapminder_extra_long']
            print("meta:", new_meta)
            print("config:", plot_data["config"])
            # create the widget
            new_widget = dlc.Widget(
                dxc.Graph(id={'type': 'fig', 'index': idnum},
                        meta=new_meta,
                        defParams=plot_data["config"],
                        plotApi="plotApi",
                        style={"height": "100%", "width": "100%"}
                        ),
                id=f'graphwidget-{idnum}',
                title="Graph")
            widgets.append(new_widget)
    return widgets


@app.server.route("/plotApi", methods=['POST', 'GET'])
def plotApi():
    # create the plot for a dataframe
    params = request.get_json()
    print("here")
    if request.method == 'POST':
        print("params:", params)
        # call the extract_dataflow function if nodes and edges are in the config 
        if "nodes" and "edges" in params and params["nodes"] is not None and params["edges"] is not None:
            print("merge from dataflow")
            outputs = ddc.extract_dataflow(params["nodes"], params["edges"], dataframe)
            if outputs is not None and len(outputs)!=0:
                df_plot = None
                df_out = None
                # search for the right dataframe for creating the meta data
                for out_map in outputs:
                    if out_map is not None and "df" in out_map and out_map["df"] is not None and "config" in out_map and out_map["config"] is not None:
                        print("first dict:", str(out_map["config"]["plot"]))
                        print("second dict:", str(params))
                        if str(out_map["config"]["plot"]) in str(params):
                            df_plot = out_map["df"]
                    elif out_map is not None and "df" in out_map and out_map["df"] is not None:
                        df_out = out_map["df"]
                if df_plot is None and df_out is not None:
                    df_plot = df_out
        # use the dataframe dict if nodes and edges are not in config
        else:
            df_plot = dataframe[params["data_list"][0]]
        print("merge query:", df_plot.query)
        fig = dxc.get_plot(df_plot, params, compute_types=["custom"])
        # return fig
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return {}


if __name__ == '__main__':
    app.run_server(debug=True)
