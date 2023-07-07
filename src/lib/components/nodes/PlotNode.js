import React, { memo } from 'react';
import { Position, useReactFlow } from 'reactflow';
import SingleHandle from './SingleHandle';

const PlotNode = ({ data, isConnectable, id }) => {
  const instance = useReactFlow();
  const this_node = instance.getNodes().filter((node) => node.id == id)[0];

  return (
    <div className="card p-2 border-secondary" style={{ minWidth: (this_node.editable) ? 180 : 130 }}>
      <SingleHandle type="target" position={Position.Top} id="i" isConnectable={isConnectable}/>

      <div className="btn-group p-1" style={{ position: "absolute", "top": 1, "right": 1 }}>
        <button type="button" className="btn btn-outline-secondary btn-sm"><span className="fas fa-edit" aria-hidden="true"></span></button>
        {this_node.editable && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
          instance.deleteElements({ nodes: [this_node] })
        }}><span className="fas fa-trash" aria-hidden="true"></span></button>}
      </div>

      <div className="card-body p-0">
        <h5 className="card-title m-0">
        <svg xmlns="http://www.w3.org/2000/svg" height="16" className="mx-1 mb-1" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"/></svg>
          Plot</h5>
      </div>

    </div>
  );


}

export default memo(PlotNode);