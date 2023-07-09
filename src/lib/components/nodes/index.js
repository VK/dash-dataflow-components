import {getMetaOut as dbMeta, exportNode as DbNode} from './DbNode.js';
import {getMetaOut as mergeMeta, exportNode as MergeNode} from './MergeNode.js';
import {getMetaOut as filterMeta, exportNode as FilterNode} from './FilterNode.js';
import OutputNode from './OutputNode.js';
import PlotNode from './PlotNode.js';
import {getMetaOut as trafoMeta, exportNode as TrafoNode} from './TrafoNode.js';


const nodeTypes = { merge: MergeNode, db: DbNode, filter: FilterNode, out: OutputNode, plot:PlotNode, trafo:TrafoNode};
const metaGetters = { merge: mergeMeta, db: dbMeta, filter: filterMeta, trafo:trafoMeta};

export {metaGetters, nodeTypes};