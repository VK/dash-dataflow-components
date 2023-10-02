# test for functions in the file interact.py
import dash_dataflow_components as ddc
import plotly.express as px
import datetime

nodes = [{'id': 'n3', 'type': 'filter', 'data': {'config': [{'col': 'country', 'type': 'isin', 'value': ['Afghanistan']}]}}, 
         {'id': 'n2', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}, 
         {'id': 'n1', 'type': 'merge', 'data': {'left_on': ['country'], 'right_on': ['country'], 'left_p': 'A', 'right_p': 'B', 'how': 'inner'}}, 
         {'id': 'n4', 'type': 'plot', 'data': {'config': {'type': 'scatter', 'params': {'x': 'A»year', 'y': 'A»pop', 'render_mode': 'webgl'}}}}, 
         {'id': 'n0', 'type': 'db', 'data': {'name': 'gapminder_extra_long'}}]
edges = [{'source': 'n1', 'target': 'out', 'sourceHandle': 'o', 'targetHandle': 'i'}, 
         {'source': 'n2', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i2'}, 
         {'source': 'n0', 'target': 'n3', 'sourceHandle': 'o', 'targetHandle': 'i'}, 
         {'source': 'n3', 'target': 'n1', 'sourceHandle': 'o', 'targetHandle': 'i1'}]
dataframe = {}
dataframe["gapminder_extra_long"] = px.data.gapminder()
dataframe["gapminder_extra_long"]["time"] = datetime.datetime.now()


def test_get_node_tree():
    tree = ddc.get_node_tree(nodes, edges)
    print("created node tree:", tree)
    assert type(tree) == list
    assert tree is not None

def test_get_node_tree_with_start_node():
    tree = ddc.get_node_tree(nodes, edges, nodes[2])
    print("created node tree with start node:", tree)
    assert type(tree) == list
    assert tree is not None

def test_extract_dataflow():
    outputs = ddc.extract_dataflow(nodes, edges, dataframe)
    print("extracted outputs:", outputs)
    for elem in outputs:
        assert "df" in elem
        assert elem["df"] is not None
        assert "config" in elem
        assert "nodes" in elem["config"]
        assert "edges" in elem["config"]