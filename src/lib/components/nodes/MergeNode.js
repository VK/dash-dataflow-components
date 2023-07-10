import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import SingleHandle from './SingleHandle';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Select from 'react-select'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const handleLeft = { left: "calc(50% - 40px)" };
const handleRight = { left: "calc(50% + 40px)" };

const getMetaOut = (id, allmeta, data, inputs) => {
  const inputs_A = inputs.filter((el) => el.target === id && el.targetHandle === "i1");
  const inputs_B = inputs.filter((el) => el.target === id && el.targetHandle === "i2");
  let meta_A = (inputs_A.length == 1 && inputs_A[0].source in allmeta) ? allmeta[inputs_A[0].source] : {};
  let meta_B = (inputs_B.length == 1 && inputs_B[0].source in allmeta) ? allmeta[inputs_B[0].source] : {};


  let update_keys = (addon, a) => {
    if (addon && addon != "") {
      a[0] = addon + "»" + a[0]
    }
    return a;
  }

  const left_on = (data && "left_on" in data) ? data.left_on : [];
  const right_on = (data && "right_on" in data) ? data.right_on : [];
  const left_p = (data && "left_p" in data) ? data.left_p : "";
  const right_p = (data && "right_p" in data) ? data.right_p : "";

  const output_meta = Object.fromEntries(Object.entries(meta_A).filter(([key]) => left_on.includes(key)));
  // we might also want to merge the metadata

  meta_A = Object.fromEntries(
    Object.entries(meta_A).filter(([key]) => !left_on.includes(key)).map((el) => update_keys(left_p, el))
  );
  meta_B = Object.fromEntries(
    Object.entries(meta_B).filter(([key]) => !right_on.includes(key)).map((el) => update_keys(right_p, el))
  );


  return { ...output_meta, ...meta_A, ...meta_B };
}




const getNode = ({ data, isConnectable, id }) => {

  const instance = useReactFlow();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];
  const input_edges = instance.getEdges().filter((edge) => edge.target == id);
  const possible_nodes = instance.getNodes()


  const meta_dict = input_edges.reduce((acc, edge) => {
    const { source, targetHandle } = edge;

    const node = possible_nodes.filter((n) => n.id == source);
    if (node.length == 1) {
      acc[targetHandle] = this_node.meta[source];
    }
    return acc;
  }, {});


  const merge_options = [{ value: "inner", label: "inner" }]
  let options_A = [];
  let options_B = [];
  if (meta_dict && "i1" in meta_dict && meta_dict.i1) {
    options_A = Object.entries(meta_dict.i1).map(([key, value]) => ({ value: key, label: key }));
  }
  if (meta_dict && "i2" in meta_dict && meta_dict.i2) {
    options_B = Object.entries(meta_dict.i2).map(([key, value]) => ({ value: key, label: key }));
  }

  const [selected_A, setSelected_A] = useState([]);
  const [selected_B, setSelected_B] = useState([]);







  let merge_cols = undefined;
  if (data && "left_on" in data && data.left_on && "right_on" in data && data.right_on) {

    merge_cols = data.left_on.map((element1, index) => {
      const element2 = data.right_on[index];

      // Perform operations using element1 and element2
      return (
        <tr key={"merge" + index}>
          <td className='p-2'>{index + 1}</td>
          <td className='p-2'>{element1}</td>
          <td className='p-2'>{element2}</td>
          <td><Button onClick={() => {

            let left_on = (data.left_on) ? data.left_on : [];
            let right_on = (data.right_on) ? data.right_on : [];
            left_on.splice(index, 1);
            right_on.splice(index, 1);

            let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, left_on: left_on, right_on: right_on } } : el);
            this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());

          }}>Del</Button></td>
        </tr>
      );
    });
  }



  return (
    <div className="card p-2 border-secondary" style={{ minWidth: (this_node.editable) ? 180 : 130 }}>
      <SingleHandle type="target" position={Position.Top} style={handleLeft} id="i1" isConnectable={isConnectable} maxconnections={2} />
      <SingleHandle type="target" position={Position.Top} style={handleRight} id="i2" isConnectable={isConnectable} maxconnections={2} />

      {this_node.editable &&
        <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsOpen(true)}><span className="fas fa-edit" aria-hidden="true"></span></button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
            instance.deleteElements({ nodes: [this_node] })
          }}><span className="fas fa-trash" aria-hidden="true"></span></button>
        </div>
      }

      <div className="card-body p-0">
        <h5 className="card-title m-0">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1" viewBox="0 0 448 512"><path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM248 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" /></svg>
          {(data && data.label) ? data.label : "Merge"}</h5>
      </div>


      <Modal
        centered
        backdrop="static"
        animation={false}
        show={modalIsOpen}
        onHide={() => setIsOpen(false)}
        enforceFocus={true}
        size="lg"
      >
        <Modal.Header closeButton>
          {this_node.editable && <Modal.Title>
            <div class="input-group input-group-lg">
              <div class="input-group-prepend">
                <span class="input-group-text h-100" id="inputGroupPrepend">Label</span>
              </div>
              <Form.Control style={{ fontWeight: 700, fontSize: "1.5rem" }} size="lg" placeholder="Merge" value={(data && "label" in data) ? data.label : ''} onChange={(e) => {
                let val = e.target.value;
                let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, label: (val != "") ? val : undefined } } : el);
                this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());
              }} /> </div>
          </Modal.Title>}
          {!this_node.editable && <Modal.Title>{(data && data.label) ? data.label : "Merge"}</Modal.Title>}
        </Modal.Header>


        <Modal.Body>
          <b>Merge type: </b>
          <Select options={merge_options} value={(data && "how" in data) ? { label: data.how, value: data.how } : undefined}


            onChange={(option) => {

              let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, how: option.value } } : el);
              this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());

            }}></Select>


          <Table striped bordered hover size="sm" className='mt-3'>
            <thead>
              <tr>
                <th className='p-2'>#</th>
                <th className='p-2'>Left columns</th>
                <th className='p-2'>Right columns</th>
                <th className='p-2'></th>
              </tr>
            </thead>
            <tbody>


              {merge_cols}

              <tr>
                <td className='p-2'>new</td>
                <td className='w-50'><Select options={options_A} value={selected_A} onChange={setSelected_A} /></td>
                <td className='w-50'><Select options={options_B} value={selected_B} onChange={setSelected_B} /></td>
                <td><Button onClick={() => {

                  let left_on = (data.left_on) ? data.left_on : [];
                  let right_on = (data.right_on) ? data.right_on : [];
                  left_on.push(selected_A.value);
                  right_on.push(selected_B.value);

                  let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, left_on: left_on, right_on: right_on } } : el);
                  this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());

                }}>Add</Button></td>
              </tr>

              <tr>
                <td className='p-2'>Prefix</td>
                <td><Form.Control placeholder="Left prefix" value={(data && "left_p" in data) ? data.left_p : ''} onChange={(e) => {

                  let val = e.target.value;

                  let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, left_p: (val != "") ? val : undefined } } : el);
                  this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());

                }} /></td>
                <td><Form.Control placeholder="Left prefix" value={(data && "right_p" in data) ? data.right_p : ''} onChange={(e) => {

                  let val = e.target.value;

                  let new_nodes = this_node.main.state.nodes.map((el) => (el.id == this_node.id) ? { ...el, data: { ...data, right_p: (val != "") ? val : undefined } } : el);
                  this_node.main.setState({ nodes: new_nodes }, () => this_node.main.updateOutput());

                }} /></td>
                <td></td>
              </tr>
            </tbody>
          </Table>



        </Modal.Body>

      </Modal>

      <Handle type="source" position={Position.Bottom} id="o" isConnectable={isConnectable} />
    </div>
  );


}

const exportNode = memo(getNode)
export { getMetaOut, exportNode };
