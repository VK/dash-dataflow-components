import { useReactFlow, useStore } from 'reactflow';

import './nodes/css/index.css';

const Sidebar = () => {

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{width: 0, height: 0, position: "relative", zIndex:10000}}>

      <div className="card p-2 border-secondary"
        onDragStart={(event) => onDragStart(event, 'db')} draggable
        style={{width: 50}}
        >
        <div className="card-body p-0">
          <h5 className="card-title m-0">
            <span className='p-1'>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" viewBox="0 0 448 512"><path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" /></svg>
            </span>
          </h5>
        </div>
      </div>


      <div className="card p-2 border-secondary"
        onDragStart={(event) => onDragStart(event, 'filter')} draggable
        style={{width: 50}}
        >
        <div className="card-body p-0">
          <h5 className="card-title m-0">
            <span className='p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
            </span>
          </h5>
        </div>
      </div>


      <div className="card p-2 border-secondary"
        onDragStart={(event) => onDragStart(event, 'merge')} draggable
        style={{width: 50}}
        >
        <div className="card-body p-0">
          <h5 className="card-title m-0">
            <span className='p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 448 512"><path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM248 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" /></svg>
            </span>
          </h5>
        </div>
      </div>      


    </div>
  );
};

export default Sidebar;