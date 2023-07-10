import { useReactFlow, useStore } from 'reactflow';

import './nodes/css/index.css';

const button_style = { width: 30, height: 30, padding: 2, paddingBottom: 4, background: "#fff" };
const icon_width = 16;

const SideBar = (props) => {

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ width: 0, height: 0, position: "relative", zIndex: 100, top: 15, left: 15, display: "revert" }}>

      <div className='btn-group-vertical'>

        {(props.nodeTypes.includes("db")) &&
          <button type="button" className="btn btn-outline-secondary" onDragStart={(event) => onDragStart(event, 'db')} draggable style={button_style}>
            <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} viewBox="0 0 448 512"><path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" /></svg>
          </button>
        }

        {(props.nodeTypes.includes("filter")) &&
          <button type="button" className="btn btn-outline-secondary" onDragStart={(event) => onDragStart(event, 'filter')} draggable style={button_style}>
            <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" /></svg>
          </button>
        }

        {(props.nodeTypes.includes("merge")) &&
          <button type="button" className="btn btn-outline-secondary" onDragStart={(event) => onDragStart(event, 'merge')} draggable style={button_style}>
            <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} viewBox="0 0 448 512"><path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM248 432a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" /></svg>
          </button>
        }

        {(props.nodeTypes.includes("trafo")) &&
          <button type="button" className="btn btn-outline-secondary" onDragStart={(event) => onDragStart(event, 'trafo')} draggable style={button_style}>
            <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} viewBox="0 0 512 512"><path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
          </button>
        }

        {(props.nodeTypes.includes("plot")) &&
          <button type="button" className="btn btn-outline-secondary" onDragStart={(event) => onDragStart(event, 'plot')} draggable style={button_style}>
            <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z" /></svg>
          </button>
        }

        {(props.nodeTypes.includes("out")) &&
          <button type="button" className="btn btn-outline-secondary" onDragStart={(event) => onDragStart(event, 'out')} draggable style={button_style}>
            <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} viewBox="0 0 640 512"><path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z" /></svg>
          </button>
        }


      </div>

      <div className='btn-group-vertical mt-3'>

        <button type="button" className="btn btn-outline-secondary"  style={button_style} >
        <svg xmlns="http://www.w3.org/2000/svg" width={icon_width} height="1em" viewBox="0 0 576 576"><path d="m 244.13477,0 c -26.49995,0 -48,17.02752 -48,38.014839 v 12.671614 50.686457 12.67161 c 0,20.98732 21.50005,38.01484 48,38.01484 h 14.19921 v 24.32233 h -16.5332 c -26.49994,0 -48,17.02751 -48,38.01483 v 12.67161 50.68646 12.67162 c 0,20.9873 21.50006,38.01483 48,38.01483 H 256 v 25.34323 H 69.248047 v 38.37525 12.31121 19.46991 h -16 c -26.499948,0 -48.0000001,17.02752 -48.0000001,38.01484 v 12.67161 50.68645 12.67162 C 5.2480469,558.97248 26.748099,576 53.248047,576 h 96.000003 c 26.49994,0 48,-17.02752 48,-38.01484 v -76.02968 c 0,-20.98732 -21.50006,-38.01484 -48,-38.01484 h -16 v -19.46991 h 307.86328 v 19.44207 h -16.12305 c -26.49994,0 -48,17.02751 -48,38.01484 v 12.67161 50.68646 12.67162 c 0,20.9873 21.50006,38.01483 48,38.01483 h 96 c 26.49994,0 48,-17.02753 48,-38.01483 v -76.02969 c 0,-20.98733 -21.50006,-38.01484 -48,-38.01484 H 505.11133 V 404.47073 392.15952 353.78427 H 320 v -25.34323 h 17.80078 c 26.49994,0 48,-17.02753 48,-38.01483 v -76.02969 c 0,-20.98732 -21.50006,-38.01483 -48,-38.01483 h -15.4668 v -24.32233 h 17.80079 c 26.49994,0 48,-17.02752 48,-38.01484 V 38.014839 C 388.13477,17.02752 366.63471,0 340.13477,0 Z"/></svg>
        </button>

      </div>
    </div>
  );
};

export default SideBar;