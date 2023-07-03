import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';


const OutputNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();

  return (
    <div className="card p-2 border-secondary" style={{ minWidth: 180 }}>
      <Handle type="target" position={Position.Top} id="a" isConnectable={isConnectable} />

      <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
        <button type="button" className="btn btn-outline-secondary btn-sm"><span className="fas fa-edit" aria-hidden="true"></span></button>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
          const toDelete = instance.getNodes().filter((node) => node.id == id);
          instance.deleteElements({ nodes: toDelete })
        }}><span className="fas fa-trash" aria-hidden="true"></span></button>
      </div>

      <div className="card-body p-0">
        <h5 className="card-title m-0">
          <span className='p-1'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z"/></svg>
          </span>
          Output</h5>
      </div>

    </div>
  );


}

export default memo(OutputNode);