
module DashDataflowComponents
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.7"

include("jl/''_dataflow.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_dataflow_components",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "dash_dataflow_components.min.js",
    external_url = "https://unpkg.com/dash_dataflow_components@0.0.7/dash_dataflow_components/dash_dataflow_components.min.js",
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_dataflow_components.min.js.map",
    external_url = "https://unpkg.com/dash_dataflow_components@0.0.7/dash_dataflow_components/dash_dataflow_components.min.js.map",
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
