import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';




const FilterNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];

  return (
    <div className="card p-2 border-secondary" style={{ minWidth: (this_node.editable) ? 180 : 130 }}>
      <Handle type="target" position={Position.Top} id="i" isConnectable={isConnectable} />

      <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
        <button type="button" className="btn btn-outline-secondary btn-sm"><span className="fas fa-edit" aria-hidden="true"></span></button>
        {this_node.editable && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
          instance.deleteElements({ nodes: [this_node] })
        }}><span className="fas fa-trash" aria-hidden="true"></span></button>}
      </div>

      <div className="card-body p-0">
        <h5 className="card-title m-0">
        <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1"  viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
          Filter</h5>
      </div>

      <Handle type="source" position={Position.Bottom} id="o" isConnectable={isConnectable} />
    </div>
  );


}

export default memo(FilterNode);