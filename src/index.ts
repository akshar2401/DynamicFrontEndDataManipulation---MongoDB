import setUpStringType from "./String";
setUpStringType();
import FilterQueryParser from "./DataProcessing/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Visitors";
const parser = new FilterQueryParser();
const output = parser.parse("baaa");
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
printVisitor.visit(output);
