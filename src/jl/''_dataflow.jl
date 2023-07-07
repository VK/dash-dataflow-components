# AUTO GENERATED FILE - DO NOT EDIT

export ''_dataflow

"""
    ''_dataflow(;kwargs...)

A DataFlow component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `edges` (Array; optional): Array of edges connecting the nodes
- `graphType` (String; optional): Type of the graph structure [singleOutput, multiPlot]
- `meta` (Dict; required): Metadata dictionary of the available databases
- `nodeTypes` (Array of Strings; optional): Metadata dictionary of the available databases
- `nodes` (Array; optional): Array of nodes
"""
function ''_dataflow(; kwargs...)
        available_props = Symbol[:id, :edges, :graphType, :meta, :nodeTypes, :nodes]
        wild_props = Symbol[]
        return Component("''_dataflow", "DataFlow", "dash_dataflow_components", available_props, wild_props; kwargs...)
end

