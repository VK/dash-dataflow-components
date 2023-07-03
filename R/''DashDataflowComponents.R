# AUTO GENERATED FILE - DO NOT EDIT

#' @export
''DashDataflowComponents <- function(id=NULL, label=NULL, value=NULL) {
    
    props <- list(id=id, label=label, value=value)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashDataflowComponents',
        namespace = 'dash_dataflow_components',
        propNames = c('id', 'label', 'value'),
        package = 'dashDataflowComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
