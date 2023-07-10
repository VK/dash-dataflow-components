import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';


const getMetaOut = (id, allmeta, data, inputs) => {

  if (data && "name" in data) {
    return allmeta[data.name];

  }
  else {
    return {};
  }
}


const getNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];


  let db_options = []
  if (this_node.meta) {
    db_options = Object.keys(this_node.meta).map((el) => { return { value: el, label: el } });
  }
  let default_value = undefined;
  if (data != undefined) {
    const matching_options = db_options.filter((el) => el.value === data.name);
    if (matching_options.length == 1) {
      default_value = matching_options[0];
    }
  }

  let update_state = () => {
    let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { "name": default_value.value } } : el);
    this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());
  }

  return (
    <div className="dfc-card" >

      {this_node.editable &&
        <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1, background: "#fff" }}>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsOpen(true)}><span className="fas fa-edit" aria-hidden="true"></span></button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
            instance.deleteElements({ nodes: [this_node] })
          }}><span className="fas fa-trash" aria-hidden="true"></span></button>
        </div>
      }

      <div className="dfc-card-body">
        <h5 className="dfc-card-title">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1" viewBox="0 0 448 512"><path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" /></svg>
          {(data && data.label) ? data.label : "DB"}</h5>
      </div>

      <Handle type="source" position={Position.Bottom} id="o" isConnectable={isConnectable} />


      <Modal
        centered
        backdrop="static"
        animation={false}
        show={modalIsOpen}
        onHide={() => setIsOpen(false)}
      >


        <Modal.Header closeButton>
          {this_node.editable && <Modal.Title>
            <div className="input-group input-group-lg">
              <div className="input-group-prepend">
                <span className="dfc-input-group-text" id="inputGroupPrepend">Label</span>
              </div>
              <Form.Control style={{ fontWeight: 700, fontSize: "1.5rem" }} size="lg" placeholder="DB" value={(data && "label" in data) ? data.label : ''} onChange={(e) => {
                let val = e.target.value;
                let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, label: (val != "") ? val : undefined } } : el);
                this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());
              }} /> </div>
          </Modal.Title>}
          {!this_node.editable && <Modal.Title>{(data && data.label) ? data.label : "DB"}</Modal.Title>}
        </Modal.Header>



        <Modal.Body>

          <Select options={db_options}
            defaultValue={default_value}
            onChange={(choice) => {
              default_value = choice;
              update_state();
            }} />

          {(default_value !== undefined && default_value.value in this_node.meta) &&
            <div style={{ maxHeight: 200, overflowY: "scroll" }} className='mt-2' >
              <Table striped bordered hover >
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this_node.meta[default_value.value]).map((k) => (

                    <tr key={k} >
                      <td>{k}</td>
                      <td>{this_node.meta[default_value.value][k].type}</td>
                    </tr>)

                  )}

                </tbody>
              </Table></div>
          }


        </Modal.Body>

      </Modal>
    </div >
  );


}

const exportNode = memo(getNode)
export { getMetaOut, exportNode };