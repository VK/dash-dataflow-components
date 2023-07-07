import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactFlow, { MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, isEdge, addEdge, setNodes } from 'reactflow';

import dagre from 'dagre';

import 'reactflow/dist/style.css';

import nodeTypes from "./nodes/nodeTypes"

import SideBar from './SideBar.react';
import { apply, prop } from 'ramda';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from 'react-bootstrap';



/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class DataFlow extends Component {

    update_internal_nodes = (nodes, edges) => {

        var g = new dagre.graphlib.Graph();
        // Set an object for the graph label
        g.setGraph({ rankDir: "TB", ranker: "tight-tree" });

        // Default to assigning a new object as a label for each new edge.
        g.setDefaultEdgeLabel(function () { return {}; });

        nodes.forEach((el) => { g.setNode(el.id, { label: el.id, width: 200, height: 36 }); });
        edges.forEach((el) => { g.setEdge(el.source, el.target); });

        dagre.layout(g);

        let positions = {};
        g.nodes().forEach(function (v) {
            let el = g.node(v);
            if (el && el !== undefined) {
                console.log("Node " + v + ": " + JSON.stringify(el));
                positions[el.label] = { x: el.x, y: el.y };
            }
        });

        return {
            nodes: nodes.map((el) => { return { ...el, position: positions[el.id] } }),
            edges: edges.map((el) => { return { ...el, id: el.source + el.sourceHandle + "-" + el.target + el.targetHandle, animated: true } })
        }
    }
    get_external_nodes = (nodes) => {
        return nodes.map((el) => { return { id: el.id, type: el.type } })
    }
    get_external_edges = (edges) => {
        const node_ids = this.state.nodes.map((el) => el.id);
        return edges.map((el) => { return { source: el.source, target: el.target, sourceHandle: el.sourceHandle, targetHandle: el.targetHandle } }).filter((el) => node_ids.some((e) => e === el.source)).filter((el) => node_ids.some((e) => e === el.target))
    }

    constructor(props) {
        super(props);

        this.setProps = props.setProps;

        if (props.graphType === "singleOutput") {
            const nr_output_nodes = props.nodes.filter((el) => el.type === 'out').length;
            console.log(nr_output_nodes)

            if (nr_output_nodes == 0) {
                props.nodes.push({
                    id: "out",
                    type: "out"
                })
            }

        }


        this.state = {
            id: props.id,
            eNodes: props.nodes,
            eEdges: props.edges,
            showFlowModal: false,
            meta: props.meta,
            ...this.update_internal_nodes(props.nodes, props.edges)
        };
        console.log(this.state);

        this.reactFlowWrapper = React.createRef();
        this.reactFlowDiv = React.createRef();

        const int_ids = props.nodes.map(el => parseInt(el.id.replace(/\D/g, '')));

        if (int_ids.length == 0) {
            this.ids = 0;
        } else {
            this.ids = Math.max(...int_ids) + 1;
        }
    }

    onConnect = (edge_to_add) => {

        edge_to_add.animated = true;

        const new_edges = addEdge(edge_to_add, this.state.edges);


        this.setState({
            edges: new_edges
        })
        // if (this.setProps) this.setProps({
        //     edges: this.get_external_edges(new_edges)
        // })
    }

    onNodesChange = (nodes) => {
        const new_nodes = applyNodeChanges(nodes, this.state.nodes);


        this.setState({
            nodes: new_nodes
        })
        // if (this.setProps) this.setProps({
        //     nodes: this.get_external_nodes(new_nodes)
        // })
    }


    onEdgesChange = (edges) => {

        if (edges.length > 0 && "id" in edges[0] && edges[0].type === 'select') {
            const del_id = edges[0].id;

            const new_edges = this.state.edges.filter((el) => el.id !== del_id);


            this.setState({
                edges: new_edges
            })
            // if (this.setProps) this.setProps({
            //     edges: this.get_external_edges(new_edges)
            // })

        }

    }

    getId = () => `n${this.ids++}`;

    onDrop = (event) => {

        event.preventDefault();

        const reactFlowBounds = this.reactFlowDiv.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
            return;
        }

        let position = {
            x: event.clientX - reactFlowBounds.left - 15,
            y: event.clientY - reactFlowBounds.top - 15,
        };
        if (this.state.instance) {
            position = this.state.instance.project({
                x: event.clientX - reactFlowBounds.left - 15,
                y: event.clientY - reactFlowBounds.top - 40,
            });
        }

        const newNode = {
            id: this.getId(),
            type,
            position,
            data: { label: `${type} node` },
        };

        this.onNodesChange([{ item: newNode, type: "add" }]);
    }

    onDragOver = (event) => {

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

    }

    handleClose = () => {

        const res = this.update_internal_nodes(
            this.get_external_nodes(this.state.nodes),
            this.get_external_edges(this.state.edges)
        )

        if (this.setProps) this.setProps({
            edges: this.get_external_edges(res.edges),
            nodes: this.get_external_nodes(res.nodes),
        })

        this.setState({ showFlowModal: false, ...res });

        let view = this.state.viewInstance;
        setTimeout(() => view.fitView({ duration: 200 }), 100);

    }
    handleShow = (e) => {
        console.log(e);
        this.setState({ showFlowModal: true });
    }

    getInstance = (i) => {
        this.setState({ instance: i });
    }
    getViewInstance = (i) => {
        this.setState({ viewInstance: i });
    }


    /**
     * if the plot config changes and the extra plotApi should be used
     * Then we have to update the content
     * @private
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        console.log(newProps);

    }

    render() {
        const { id, nodes, edges, showFlowModal } = this.state;

        return (
            <div id={id} style={{ width: '100%', height: '100%' }} ref={this.reactFlowWrapper}>
                <ReactFlowProvider>

                    <Modal
                        centered
                        backdrop="static"
                        animation={false}
                        show={showFlowModal}
                        onHide={() => this.handleClose()
                        }
                        size="lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>DataFlow</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ width: '100%', height: 500, padding: 0 }} ref={this.reactFlowDiv}>

                            <SideBar nodeTypes={this.props.nodeTypes} graphType={this.props.graphType} />
                            <ReactFlow
                                nodes={nodes.map((el) => { return { ...el, editable: true, meta: this.state.meta, main:this } })}
                                edges={edges}
                                onNodesChange={this.onNodesChange}
                                onEdgesChange={this.onEdgesChange}
                                nodeTypes={nodeTypes}
                                onConnect={this.onConnect}
                                onDrop={this.onDrop}
                                onDragOver={this.onDragOver}
                                onInit={this.getInstance}
                                minZoom={0.01}
                                fitView
                            >
                                <MiniMap zoomable pannable />
                                <Controls />
                            </ReactFlow>
                        </Modal.Body>
                    </Modal>
                </ReactFlowProvider>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes.map((el) => { return { ...el, editable: false, meta: this.state.meta, main:this } })}
                        edges={edges}
                        fitView
                        nodesDraggable={false}
                        edgesFocusable={false}
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                        onInit={this.getViewInstance}
                        nodeTypes={nodeTypes}
                        minZoom={0.01}
                    ></ReactFlow>
                    <div style={{ position: "relative", left: -15, bottom: 45, textAlign: "right" }}>
                        <a className="editFlowButton" onClick={this.handleShow} key={this.props.id + "-edit-button"}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="1.3em" width="1.3em">
                                <path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                            </svg>
                        </a>
                    </div>

                </ReactFlowProvider>

            </div>
        );
    }
}

DataFlow.defaultProps = {
    nodeTypes: ["db", "merge", "filter", "trafo", "plot"],
    graphType: "multiPlot",
    nodes: [],
    edges: []
};

DataFlow.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Metadata dictionary of the available databases
     */
    meta: PropTypes.object.isRequired,    

    /**
     * Array of nodes
     */
    nodes: PropTypes.array,

    /**
     * Array of edges connecting the nodes
     */
    edges: PropTypes.array,

    /**
     * Metadata dictionary of the available databases
     */
    nodeTypes: PropTypes.arrayOf(PropTypes.string),

    /**
     * Type of the graph structure [singleOutput, multiPlot]
     */
    graphType: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};
