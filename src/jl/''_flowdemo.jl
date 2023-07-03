# AUTO GENERATED FILE - DO NOT EDIT

export ''_flowdemo

"""
    ''_flowdemo(;kwargs...)

A FlowDemo component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `edges` (Array; required): The value displayed in the input.
- `nodes` (Array; required): A label that will be printed when this component is rendered.
"""
function ''_flowdemo(; kwargs...)
        available_props = Symbol[:id, :edges, :nodes]
        wild_props = Symbol[]
        return Component("''_flowdemo", "FlowDemo", "dash_dataflow_components", available_props, wild_props; kwargs...)
end

