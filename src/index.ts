import setUpStringType from "./String";
setUpStringType();
import FilterQueryParser from "./DataProcessing/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Visitors";
import { ConditionNode } from "./DataProcessing";
import { GrammarNode } from "./DataProcessing/Grammar";
const parser = new FilterQueryParser();
const output = parser.parse(
  '{b87: b2.34, 1: "a", c..@#: {d: 1, "ss": 45, obj: [{m: m},[1,2,4]]}} > [1, 2, {a: 1, b45: 2}]'
);
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
printVisitor.visit(output);
const gm = new GrammarNode("logicalOr");
gm.addRule("lhs:logicalAnd || rhs:logicalOr");
gm.addRule("logicalAnd");
console.log(gm.emit());
