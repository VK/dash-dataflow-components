import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import SingleHandle from './SingleHandle';
import Modal from 'react-bootstrap/Modal';

const getMetaOut = (id, allmeta, data, inputs) => {

  const input_ids = inputs.map((e) => e.source);

  if (input_ids.length == 1 && input_ids[0] in allmeta) {
    const in_meta = allmeta[input_ids[0]];

    if (data && "config" in data) {

      const f = new dash_express_components.Filter(
        {
          id: "dummy_filter",
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


  let update_state = (new_config) => {
    let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...el.data, "config": new_config } } : el);
    this_node.main.setState({ nodes: new_nodes },
      () => this_node.main.updateOutput()
    );
  }

  const needed_meta = (this_input && this_input.source in this_node.meta) ? this_node.meta[this_input.source] : {};

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
          <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" /></svg>
          Filter</h5>
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
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <dash_express_components.Filter
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


