import { useReactFlow, useStore } from 'reactflow';

import './nodes/css/index.css';

const Sidebar = () => {

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="aside">
      
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'out')} draggable>
        Output
      </div>

    </aside>
  );
};

export default Sidebar;