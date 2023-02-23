import FilterQueryParser from "./DataProcessing/Filter/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Filter/Visitors";
import GeneralFilterSplitter from "./DataProcessing/Filter/GeneralFilterSplitter";
import setUpStringType from "./String";
import {
  KeyValuePairNode,
  ObjectNode,
  ObjectSeparatorNode,
} from "./DataProcessing";
import { DefaultComparisonOperatorGrammarRule } from "./DataProcessing/Filter/Grammar/DefaultGrammar/ComparisonOperatorGrammarRule";
setUpStringType();

const parser = new FilterQueryParser();
console.log("true && false".length);
const tree = parser.parse("true && false");
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
const comparisonOp = new DefaultComparisonOperatorGrammarRule();
printVisitor.visit(tree);
comparisonOp.rules.forEach((rule) => console.log(rule));
comparisonOp.addRule("dd");
