# AUTO GENERATED FILE - DO NOT EDIT

#' @export
''DataFlow <- function(id=NULL, edges=NULL, meta=NULL, nodes=NULL) {
    
    props <- list(id=id, edges=edges, meta=meta, nodes=nodes)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DataFlow',
        namespace = 'dash_dataflow_components',
        propNames = c('id', 'edges', 'meta', 'nodes'),
        package = 'dashDataflowComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
