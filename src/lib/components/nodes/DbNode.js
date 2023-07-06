import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';


const DbNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];

  return (
    <div className="card p-2 border-secondary" style={{ minWidth: (this_node.editable) ? 180 : 130 }}>

      {this_node.editable &&
        <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
          <button type="button" className="btn btn-outline-secondary btn-sm"><span className="fas fa-edit" aria-hidden="true"></span></button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
            instance.deleteElements({ nodes: [this_node] })
          }}><span className="fas fa-trash" aria-hidden="true"></span></button>
        </div>
      }

      <div className="card-body p-0">
        <h5 className="card-title m-0">
          <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1"  viewBox="0 0 448 512"><path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"/></svg>
          DB</h5>
      </div>

      <Handle type="source" position={Position.Bottom} id="o" isConnectable={isConnectable} />
    </div>
  );


}

export default memo(DbNode);