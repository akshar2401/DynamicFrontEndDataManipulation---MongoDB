import FilterQueryParser from "./DataProcessing/Filter/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Filter/Visitors";
import GeneralFilterSplitter from "./DataProcessing/Filter/GeneralFilterSplitter";
import setUpStringType from "./String";
setUpStringType();

const parser = new FilterQueryParser();
const tree = parser.parse(
  '1 == 3 && !true && (x == 1 || (1 in [1, 2, 3] && x > 1) && y in {"a": 1, "b":1}) && u > 9'
);
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
printVisitor.visit(tree);
const filterSplitter = new GeneralFilterSplitter();
const filters = filterSplitter.split(tree);
filters.forEach((filter) => printVisitor.visit(filter));
