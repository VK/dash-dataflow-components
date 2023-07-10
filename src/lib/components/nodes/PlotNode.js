import React, { memo } from 'react';
import { Position, useReactFlow } from 'reactflow';
import SingleHandle from './SingleHandle';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const PlotNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];
  const this_input = instance.getEdges().filter((edge) => edge.target == id)[0];

  let update_state = (new_config) => {
    let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...el.data, "config": new_config } } : el);
    this_node.main.setState({ nodes: new_nodes },
      () => this_node.main.updateOutput()
    );
  }

  const needed_meta = (this_input && this_input.source in this_node.meta) ? this_node.meta[this_input.source] : {};


  return (
    <div className="dfc-card" >
      <SingleHandle type="target" position={Position.Top} id="i" isConnectable={isConnectable} />

      <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsOpen(true)}><span className="fas fa-edit" aria-hidden="true"></span></button>
        {this_node.editable && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
          instance.deleteElements({ nodes: [this_node] })
        }}><span className="fas fa-trash" aria-hidden="true"></span></button>}
      </div>

      <div className="dfc-card-body">
        <h5 className="dfc-card-title">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z" /></svg>
          {(data && data.label) ? data.label : "Plot"}</h5>
      </div>

      <Modal
        centered
        backdrop="static"
        animation={false}
        show={modalIsOpen}
        onHide={() => setIsOpen(false)}
        enforceFocus={true}
      >

        <Modal.Header closeButton>
          {this_node.editable && <Modal.Title>
            <div className="input-group input-group-lg">
              <div className="input-group-prepend">
                <span className="dfc-input-group-text" id="inputGroupPrepend">Label</span>
              </div>
              <Form.Control style={{ fontWeight: 700, fontSize: "1.5rem" }} size="lg" placeholder="Plot" value={(data && "label" in data) ? data.label : ''} onChange={(e) => {
                let val = e.target.value;
                let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, label: (val != "") ? val : undefined } } : el);
                this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());
              }} /> </div>
          </Modal.Title>}
          {!this_node.editable && <Modal.Title>{(data && data.label) ? data.label : "Plot"}</Modal.Title>}
        </Modal.Header>

        
        
        <Modal.Body>

          <dash_express_components.Plotter
            id="in"
            key="test"
            config={(data && "config" in data) ? data.config : []}
            meta={needed_meta}
            setProps={out => { if ("config" in out) { update_state(out.config) } }}
          />

        </Modal.Body>
      </Modal>

    </div>
  );


}

export default memo(PlotNode);