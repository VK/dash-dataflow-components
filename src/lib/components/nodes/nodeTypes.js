import DbNode from './DbNode.js';
import MergeNode from './MergeNode.js';
import FilterNode from './FilterNode.js';
import OutputNode from './OutputNode.js';
import PlotNode from './PlotNode.js';

const nodeTypes = { merge: MergeNode, db: DbNode, filter: FilterNode, out: OutputNode, plot:PlotNode};

export default nodeTypes;