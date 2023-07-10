import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import SingleHandle from './SingleHandle';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const getMetaOut = (id, allmeta, data, inputs) => {

  const input_ids = inputs.map((e) => e.source);

  if (input_ids.length == 1 && input_ids[0] in allmeta) {
    const in_meta = allmeta[input_ids[0]];

    if (data && "config" in data) {

      const f = new dash_express_components.Transform(
        {
          id: "dummy_trafo",
          meta: in_meta,
          config: data["config"],
          setProps: (out) => { }
        });

      return f.state.meta_out;
    }

    return in_meta;
  }

  return {};
}



const getNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const this_node = instance.getNodes().filter((node) => node.id == id)[0];
  const this_input = instance.getEdges().filter((edge) => edge.target == id)[0];

  const needed_meta = (this_input && this_input.source in this_node.meta) ? this_node.meta[this_input.source] : {};

  let update_state = (new_config) => {
    let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...el.data, "config": new_config } } : el);
    this_node.main.setState({ nodes: new_nodes },
      () => this_node.main.updateOutput()
    );
  }



  return (
    <div className="card p-2 border-secondary" style={{ minWidth: (this_node.editable) ? 180 : 130 }}>
      <SingleHandle type="target" position={Position.Top} id="i" isConnectable={isConnectable} />

      <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsOpen(true)}><span className="fas fa-edit" aria-hidden="true"></span></button>
        {this_node.editable && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
          instance.deleteElements({ nodes: [this_node] })
        }}><span className="fas fa-trash" aria-hidden="true"></span></button>}
      </div>

      <div className="card-body p-0">
        <h5 className="card-title m-0">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1" viewBox="0 0 512 512"><path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
          {(data && data.label) ? data.label : "Trafo"}</h5>
      </div>

      <Handle type="source" position={Position.Bottom} id="o" isConnectable={isConnectable} />


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
            <div class="input-group input-group-lg">
              <div class="input-group-prepend">
                <span class="input-group-text h-100" id="inputGroupPrepend">Label</span>
              </div>
              <Form.Control style={{ fontWeight: 700, fontSize: "1.5rem" }} size="lg" placeholder="Trafo" value={(data && "label" in data) ? data.label : ''} onChange={(e) => {
                let val = e.target.value;
                let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, label: (val != "") ? val : undefined } } : el);
                this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());
              }} /> </div>
          </Modal.Title>}
          {!this_node.editable && <Modal.Title>{(data && data.label) ? data.label : "Trafo"}</Modal.Title>}
        </Modal.Header>



        <Modal.Body>
          <dash_express_components.Transform
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

const exportNode = memo(getNode)
export { getMetaOut, exportNode };