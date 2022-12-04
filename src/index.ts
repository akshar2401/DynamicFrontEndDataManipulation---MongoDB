import setUpStringType from "./String";
setUpStringType();
import FilterQueryParser from "./DataProcessing/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Visitors";
import { BinaryFilterNode } from "./DataProcessing";

const parser = new FilterQueryParser();
const output = parser.parse(
  "(((1 in (((([1, 2, 3, 4, true, false, [[true, false, true,false], [x, y, z]]]))))))) || true"
) as BinaryFilterNode<any>;
const printVisitor = new PrintFilterTreeVisitor(true);
printVisitor.visit(output);
