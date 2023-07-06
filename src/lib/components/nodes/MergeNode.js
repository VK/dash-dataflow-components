import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const handleLeft = { left: "calc(50% - 40px)" };
const handleRight = { left: "calc(50% + 40px)" };



const MergeNode = ({ data, isConnectable, id }) => {

  const instance = useReactFlow();
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];


  return (
    <div className="card p-2 border-secondary" style={{ minWidth: (this_node.editable) ? 180 : 130 }}>
      <Handle type="target" position={Position.Top} style={handleLeft} id="i1" isConnectable={isConnectable} />
      <Handle type="target" position={Position.Top} style={handleRight} id="i2" isConnectable={isConnectable} />

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
        <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1"  viewBox="0 0 448 512"><path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM248 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z"/></svg>
          Merge</h5>
      </div>

      <Handle type="source" position={Position.Bottom} id="o" isConnectable={isConnectable} />
    </div>
  );


}

export default memo(MergeNode);
