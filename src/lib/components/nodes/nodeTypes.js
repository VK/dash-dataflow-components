import DbNode from './DbNode.js';
import MergeNode from './MergeNode.js';
import FilterNode from './FilterNode.js';
import OutputNode from './OutputNode.js';

const nodeTypes = { merge: MergeNode, db: DbNode, filter: FilterNode, out: OutputNode};

export default nodeTypes;