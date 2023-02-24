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
import {
  BaseComparisonOperator,
  IFilterComparisonOperatorVisitor,
} from "./DataProcessing/Filter/FilterComparisonOperators";
setUpStringType();

const parser = new FilterQueryParser();
console.log("true && false".length);
const tree = parser.parse("true && false");
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
const comparisonOp = new DefaultComparisonOperatorGrammarRule();
printVisitor.visit(tree);
class Operator extends BaseComparisonOperator {
  public evaluate(...args: any[]) {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super("~");
  }
  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {}
}
comparisonOp.rules.forEach((rule) => console.log(rule));
comparisonOp.addOperator(new Operator());
comparisonOp.rules.forEach((rule) => console.log(rule));

console.log(comparisonOp.handleMatch(1, undefined));
