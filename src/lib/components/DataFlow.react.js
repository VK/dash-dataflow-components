import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactFlow, { MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, isEdge, addEdge, setNodes } from 'reactflow';


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


    constructor(props) {
        super(props);

        this.setProps = props.setProps;
        this.state = {
            nodes: props.nodes,
            edges: props.edges,
        };

        this.reactFlowWrapper = React.createRef();

        this.ids = 100;
    }

    onConnect = (edge_to_add) => {

        edge_to_add.animated = true;

        const new_edges = addEdge(edge_to_add, this.state.edges);

        this.setState({
            edges: new_edges
        })
        if (this.setProps) this.setProps({
            edges: new_edges
        })
    }

    onNodesChange = (nodes) => {
        const new_nodes = applyNodeChanges(nodes, this.state.nodes);


        this.setState({
            nodes: new_nodes
        })
        if (this.setProps) this.setProps({
            nodes: new_nodes
        })
    }


    onEdgesChange = (edges) => {
        const new_edges = applyEdgeChanges(edges, this.state.nodes).filter(isEdge);

        this.setState({
            edges: new_edges
        })
        if (this.setProps) this.setProps({
            edges: new_edges
        })
    }

    getId = () => `dndnode_${this.ids++}`;

    onDrop = (event) => {

        event.preventDefault();

        const reactFlowBounds = this.reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
            return;
        }

        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
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
        const { id, nodes, edges } = this.props;

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
