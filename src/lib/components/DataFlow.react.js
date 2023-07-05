import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactFlow, { MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, isEdge, addEdge, setNodes } from 'reactflow';

import dagre from 'dagre';

import 'reactflow/dist/style.css';

import nodeTypes from "./nodes/nodeTypes"

import Sidebar from './Sidebar';
import { apply } from 'ramda';


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
        g.setGraph({ rankDir: "TB" });

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

        console.log(positions);

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


        this.state = {
            id: props.id,
            eNodes: props.nodes,
            eEdges: props.edges,
            ...this.update_internal_nodes(props.nodes, props.edges)
        };
        console.log(this.state);

        this.reactFlowWrapper = React.createRef();

        const int_ids = props.nodes.map(el => parseInt(el.id.replace(/\D/g, '')));

        this.ids = Math.max(...int_ids) + 1;
    }

    onConnect = (edge_to_add) => {

        edge_to_add.animated = true;

        const new_edges = addEdge(edge_to_add, this.state.edges);
        

        this.setState({
            edges: new_edges
        })
        if (this.setProps) this.setProps({
            edges: this.get_external_edges(new_edges)
        })
    }

    onNodesChange = (nodes) => {
        const new_nodes = applyNodeChanges(nodes, this.state.nodes);


        this.setState({
            nodes: new_nodes
        })
        if (this.setProps) this.setProps({
            nodes: this.get_external_nodes(new_nodes)
        })
    }


    onEdgesChange = (edges) => {

        if (edges.length > 0 && "id" in edges[0] && edges[0].type === 'select') {
            const del_id = edges[0].id;

            const new_edges = this.state.edges.filter((el) => el.id !== del_id);


            this.setState({
                edges: new_edges
            })
            if (this.setProps) this.setProps({
                edges: this.get_external_edges(new_edges)
            })

        }

    }

    getId = () => `n${this.ids++}`;

    onDrop = (event) => {

        event.preventDefault();

        const reactFlowBounds = this.reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
            return;
        }

        const position = {
            x: event.clientX - reactFlowBounds.left - 15,
            y: event.clientY - reactFlowBounds.top - 15,
        };
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


    /**
     * if the plot config changes and the extra plotApi should be used
     * Then we have to update the content
     * @private
     */
    UNSAFE_componentWillReceiveProps(newProps) {

        console.log(newProps);

    }

    render() {
        const { id, nodes, edges } = this.state;

        return (
            <div id={id} style={{ width: '100%', height: '100%' }} ref={this.reactFlowWrapper}>
                <ReactFlowProvider>
                    <Sidebar />
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={this.onNodesChange}
                        onEdgesChange={this.onEdgesChange}
                        nodeTypes={nodeTypes}
                        onConnect={this.onConnect}
                        onDrop={this.onDrop}
                        onDragOver={this.onDragOver}
                        style={{ "width": "calc(100% - 60px)" }}
                        fitView
                    >
                        <MiniMap zoomable pannable />
                        <Controls />
                    </ReactFlow>
                </ReactFlowProvider>

            </div>
        );
    }
}

DataFlow.defaultProps = {};

DataFlow.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * A label that will be printed when this component is rendered.
     */
    nodes: PropTypes.array.isRequired,

    /**
     * The value displayed in the input.
     */
    edges: PropTypes.array.isRequired,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};
