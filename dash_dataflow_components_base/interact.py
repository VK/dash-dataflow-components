# for general functions used with the dash-dataflow-components
from datetime import datetime as dt, timedelta
from pandas import Timestamp


def extract_dataflow(nodes: list, edges: list, merge_dict: dict) -> list:
    """ Extract the nodes and edges of the dataflow component

    Returns a DataFrame object based on the information in the nodes and edges

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    merge_dict: dict
        dict with names of dataframes as keys and the corresponding DataFrame-object as value
    """
    # check if nodes and edges are not defined or empty or merge_dict is not defined
    if (nodes is None or len(nodes) == 1) or (edges is None or len(edges) == 0) or (merge_dict is None):
        return None
    return_df = []
    return_plots = []
    legacy_data = []
    dataflow_returns = []
    # check if the nodes list has elements of type plot or out
    for node in nodes:
        # if the node has the type plot, create a DataFrame object based on the information in the nodes and edges
        if _is_plot_node(node):
            return_plots, legacy_data = _process_plot_node(nodes, edges, node, merge_dict, legacy_data, return_plots)
        # if the node has the type out, create a DataFrame object based on the information in the nodes and edges and append the df to return_df
        if _is_out_node(node):
            df, legacy_data = _create_df(
                nodes, edges, [node], merge_dict, legacy_data)
            return_df.append(df)
    # combine the existing list dataflow_returns with the list return_plots
    dataflow_returns = dataflow_returns + return_plots
    # if return_df is not empty, append a dict with the df information and a config key set to None to dataflow_returns
    if len(return_df) != 0:
        dataflow_returns.append({"df": return_df[-1], "config": None})
    # return the created list with dataframe and config information
    return dataflow_returns


def _create_df(nodes: list, edges: list, node_tree: list, merge_dict: dict, legacy_data: list) -> tuple:
    """ Create a dataframe out of the nodes and edges of the dataflow component

    Returns a DataFrame object based on the information in the nodes and edges by calling itself to get the next node in the edges path

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    node_tree: list
        list with nodes that are already found in the edges path
    merge_dict: dict
        dict with names of dataframes as keys and the corresponding DataFrame-object as value
    legacy_data: list
        list of dicts with past trees and the corresponding dataframes
    """
    # check if nodes or edges or node_tree or merge_dict or legacy_data are not defined and return None if so
    if _error_in_df_inputs(nodes, edges, node_tree, merge_dict, legacy_data):
        return None
    current_df = None
    df1 = None
    df2 = None
    # first object in node_tree is always the newest branch in the edge path
    node = node_tree[0].copy()
    # check if a matching duplicate is in the legacy_data and return the corresponding dataframe in legacy_data
    legacy_duplicate = _is_duplicate(nodes, edges, node, legacy_data)
    if legacy_duplicate is not None and "df" in legacy_duplicate:
        return legacy_duplicate["df"], legacy_data
    # search in edges where the target of an edge is the id of the current node
    for edge in edges:
        if edge["target"] == node["id"]:
            # if the current target is an out node or plot node, get the source from the edge and call _create_df with the new tree
            if _is_out_node(node) or _is_plot_node(node):
                source = get_node_copy(nodes, edge["source"])
                new_tree = [source] + node_tree
                current_df, legacy_data = _create_df(
                    nodes, edges, new_tree, merge_dict, legacy_data)
            # if the current target is a filter node, get the source from the edge and call _create_df with the new tree
            if (node["type"] == "filter") and ("data" in node) and node["data"]["config"]:
                source = get_node_copy(nodes, edge["source"])
                new_tree = [source] + node_tree
                current_df, legacy_data = _create_df(
                    nodes, edges, new_tree, merge_dict, legacy_data)
                # if the dataframe targeting the filter node is defined, create the filter and append the current tree and dataframe to the list legacy_data
                if current_df is not None:
                    current_df = _get_filtered_df(
                        current_df, node["data"]["config"])
                current_tree = get_node_tree(nodes, edges, node)
                for current_node in current_tree:
                    del current_node["id"]
                legacy_data.append({"tree": current_tree, "df": current_df})
                return current_df, legacy_data
            # if the current target is a merge node, get the source from the edge
            if node["type"] == "merge" and "data" in node:
                source = get_node_copy(nodes, edge["source"])
                new_tree = [source] + node_tree
                # call _create_df with the new tree whether following branch targets the i1 or i2 input
                if edge["targetHandle"] == "i1":
                    df1, legacy_data = _create_df(
                        nodes, edges, new_tree, merge_dict, legacy_data)
                if edge["targetHandle"] == "i2":
                    df2, legacy_data = _create_df(
                        nodes, edges, new_tree, merge_dict, legacy_data)
                # if df1 and df2 are both yet not found, continue searching for them
                if (df1 is None) or (df2 is None):
                    continue
                # check if prefixes are selected in the dataflow component
                prefix_a = None
                prefix_b = None
                if "left_p" in node["data"] and len(node["data"]["left_p"]) > 0:
                    prefix_a = "_" + node["data"]["left_p"]
                else:
                    prefix_a = ""
                if "right_p" in node["data"] and len(node["data"]["right_p"]) > 0:
                    prefix_b = "_" + node["data"]["right_p"]
                else:
                    prefix_b = ""
                # try to merge and rename the two dataframes with the options given in the dataflow component
                try:
                    suffixes = (prefix_a, prefix_b)
                    current_df = df1.merge(df2, how=node["data"]["how"], left_on=node["data"]
                                           ["left_on"], right_on=node["data"]["right_on"], suffixes=suffixes)
                    rename_options = _create_rename_options(suffixes, current_df)
                    current_df = current_df.rename(columns=rename_options)
                # if an error occurs throw an exception
                except Exception as ex:
                    print(
                        f"Missing arguments of merge object with id {node['id']} caused error:", ex)
                current_tree = get_node_tree(nodes, edges, node)
                for current_node in current_tree:
                    del current_node["id"]
                legacy_data.append({"tree": current_tree, "df": current_df})
                return current_df, legacy_data
        elif edge["source"] == node["id"]:
            # if the current source is a db node, select the dataframe out of the merge_dict, append the current tree and dataframe to the list legacy_data and return both
            if node["type"] == "db" and "data" in node:
                current_df = merge_dict[node["data"]["name"]]
                current_tree = get_node_tree(nodes, edges, node)
                for current_node in current_tree:
                    del current_node["id"]
                legacy_data.append({"tree": current_tree, "df": current_df})
                return current_df, legacy_data
    return current_df, legacy_data


def _is_plot_node(node: dict) -> bool:
    """ get a boolean value if the node type is "plot"

    Returns True if the node type is "plot" and False if not

    Parameters:
    ===========
    node: dict
        dict with information of a node
    """
    if node["type"] == "plot":
        return True
    return False

def _is_out_node(node: dict) -> bool:
    """ get a boolean value if the node type is "out"

    Returns True if the node type is "out" and False if not

    Parameters:
    ===========
    node: dict
        dict with information of a node
    """
    if node["type"] == "out":
        return True
    return False

def _process_plot_node(nodes: list, edges: list, node: dict, 
                       merge_dict: dict, legacy_data: list, return_plots: list) -> tuple:
    """ create a DataFrame object and a config based on the information in the nodes and edges

    Returns a list of dicts with the dataframe and the correspondig config
    and returns a list of dicts with past trees and the corresponding dataframes

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    node: dict
        dict with information of a node
    merge_dict: dict
        dict with names of dataframes as keys and the corresponding DataFrame-object as value
    legacy_data: list
        list of dicts with past trees and the corresponding dataframes
    return_plots: list
        list of dicts with dataframes and the corresponding config    
    """
    df, legacy_data = _create_df(nodes, edges, [node], merge_dict, legacy_data)
    # if the dataframe creation was successful and the plot node was initialised correctly, append a dict with the df and config information to return_plots
    if (df is not None
        and "data" in node
        and "config" in node["data"]
            and node["data"]["config"] is not None):
        config = {"plot": node["data"]["config"]}
        return_plots.append({"df": df, "config": config})
    return return_plots, legacy_data

def _error_in_df_inputs(nodes: list, edges: list, node_tree: list, merge_dict: dict, legacy_data: list) -> tuple:
    """ check if nodes or edges or node_tree or merge_dict or legacy_data are not defined

    Returns True if nodes or edges or node_tree or merge_dict or legacy_data is not defined
    and returns False if they are all defined
    
    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    node_tree: list
        list with nodes that are already found in the edges path
    merge_dict: dict
        dict with names of dataframes as keys and the corresponding DataFrame-object as value
    legacy_data: list
        list of dicts with past trees and the corresponding dataframes
    """
    if (nodes is None
        or edges is None
        or node_tree is None
        or merge_dict is None
            or legacy_data is None):
        return True
    return False

def _is_duplicate(nodes: list, edges: list, node: dict, legacy_data: list) -> dict:
    """ check if a node tree in the legacy_data is matching with the node tree stored in following_tree

    Returns the element of the legacy_data which contains the duplicate information
    and returns None if no duplicate is found 

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    node: dict
        dict with information of a node
    legacy_data: list
        list of dicts with past trees and the corresponding dataframes
    """
    # initialise following_tree with the node tree of the current node by calling the function get_node_tree
    following_tree = get_node_tree(nodes, edges, node)
    # check if a node tree in the legacy_data is matching with the node tree stored in following_tree and return the corresponding dataframe in legacy_data
    if legacy_data is not None and len(legacy_data) != 0 and following_tree is not None:
        for tree_node in following_tree:
            del tree_node["id"]
        for legacy_elem in legacy_data:
            if legacy_elem["tree"] == following_tree:
                return legacy_elem
    return None

def get_node_copy(nodes: list, node_id: str) -> dict:
    """ get a a copy of a specific node out of the nodes of the dataflow component

    Returns a copy from the list of nodes by searching for the matching node_id

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    node_id: str
        id if a node that is in the list of nodes
    """
    # search for a node where its id is matching with the given node_id and return this node
    for node in nodes:
        if node["id"] == node_id:
            return node.copy()
    # if no matching node id is found return None
    return None


def _get_filtered_df(df, all_filters: list):     # TODO: type of df?
    """ Create a filtered dataframe object

    Returns a DataFrame object with all filters given to the function

    Parameters:
    ===========
    df: DataFrame object
        dataframe where the filters need to be appended 
    all_filters: list
        list of filters that need to be appended in the dataframe
    """
    # read the filtered column, the filter type and the filter value out of every filter in the list
    for filter in all_filters:
        col = filter["col"]
        t = filter["type"]
        # if the type of the filtered column is boolean, a value is not given to the filter
        if t != "istrue" and t != "isfalse":
            value = filter["value"]
        # check if t is matching with one of the following filter types and create the filtered df if so
        if t == "isin":
            df = df[df[col].isin(value)]
        elif t == "isnotin":
            df = df[~df[col].isin(value)]
        elif t == "eq":
            df = df[df[col] == value]
        elif t == "ne":
            df = df[df[col] != value]
        elif t == "gte":
            df = df[df[col] >= value]
        elif t == "gt":
            df = df[df[col] > value]
        elif t == "lte":
            df = df[df[col] <= value]
        elif t == "lt":
            df = df[df[col] < value]
        elif t == "istrue":
            df = df[df[col] == True]
        elif t == "isfalse":
            df = df[df[col] == False]
        elif t == "before":
            df = df[df[col] < value]
        elif t == "after":
            df = df[df[col] > value]
        elif t == "lastn":
            df = df[df[col] >= Timestamp(dt.now()) - timedelta(days=value)]
    # return the modyfied dataframe
    return df

def _create_rename_options(suffixes: tuple, current_df) -> dict:
    """ get the options for the rename function

    Returns a dict with the old columns as keys and the corresponding new columns as values

    Parameters:
    ===========
    suffixes: tuple
        tuple with the suffixes from the merged dataframes
    current_df: odbcdf.DataFrame
        merged dataframe that has to be renamed
    """
    rename_options = {c: suffixes[0].split("_")[1]+"»"+c[:-len(suffixes[0])] for c in current_df.columns if len(
                        suffixes[0]) > 0 and c.endswith(suffixes[0])}
    rename_options.update({c: suffixes[1].split("_")[1]+"»"+c[:-len(suffixes[1])]
                                      for c in current_df.columns if len(suffixes[1]) > 0 and c.endswith(suffixes[1])})
    return rename_options

def get_node_tree(nodes: list, edges: list, start_node: dict = None) -> list:
    """ get the node tree of a dataflow component

    Returns a list of nodes

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    start_node: dict = None
        start node of the created node tree
    """

    # check if nodes and edges are not defined or empty
    if (nodes is None or len(nodes) == 1) or (edges is None or len(edges) == 0):
        return None
    # check if start_node is not None and a excisting node and if so start the function _create_node_tree with this node
    if start_node is not None and start_node in nodes:
        return _create_node_tree(nodes, edges, [start_node.copy()]).copy()
    # search for the node with type "out" and start the function _create_node_tree with this node
    for node in nodes:
        if _is_out_node(node) or _is_plot_node(node):
            node_tree = _create_node_tree(nodes, edges, [node])
    # returns node tree given by the _create_node_tree function
    return node_tree.copy()


def _create_node_tree(nodes: list, edges: list, node_tree: list) -> list:
    """ Create the node tree out of the nodes and edges of the dataflow component

    Returns a list of nodes by calling itself to get the next node in the edges path

    Parameters:
    ===========
    nodes: list
        list of nodes from the dataflow component
    edges: list
        list of edges from the dataflow component
    node_tree: list
        list with nodes that are already found in the edges path
    """
    # check if nodes or edges or node_tree are not defined and return None if so
    if nodes is None or edges is None or node_tree is None:
        return None
    # first object in node_tree is always the newest branch in the edge path
    node = node_tree[0].copy()
    new_tree = []
    merge_tree_one = []
    merge_tree_two = []
    # search in edges where the target of an edge is the id of the current node
    for edge in edges:
        if edge["target"] == node["id"]:
            # if the current target is an out node, get the source from the edge and call _create_node_tree with the new tree
            if _is_out_node(node) or _is_plot_node(node):
                source = get_node_copy(nodes, edge["source"])
                new_tree = _create_node_tree(
                    nodes, edges, [source] + node_tree)
            # if the current target is a filter node, get the source from the edge and call _create_node_tree with the new tree
            if (node["type"] == "filter") and ("data" in node) and node["data"]["config"]:
                source = get_node_copy(nodes, edge["source"])
                new_tree = _create_node_tree(
                    nodes, edges, [source] + node_tree)
                return new_tree
            # if the current target is a merge node, get the source from the edge
            if node["type"] == "merge" and "data" in node:
                source = get_node_copy(nodes, edge["source"])
                # call _create_node_tree with the new tree whether following branch targets the i1 or i2 input
                if edge["targetHandle"] == "i1":
                    merge_tree_one = _create_node_tree(nodes, edges, [source])
                if edge["targetHandle"] == "i2":
                    merge_tree_two = _create_node_tree(nodes, edges, [source])
                # if merge_tree_one and merge_tree_two are both yet not found, continue searching for them
                if not (merge_tree_one and merge_tree_two):
                    continue
                new_tree = merge_tree_one + merge_tree_two + node_tree
                return new_tree
        elif edge["source"] == node["id"]:
            # if the current source is a db node, return the node
            if node["type"] == "db" and "data" in node:
                return node_tree
    return new_tree
