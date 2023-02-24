import FilterQueryParser from "./DataProcessing/Filter/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Filter/Visitors";
import GeneralFilterSplitter from "./DataProcessing/Filter/GeneralFilterSplitter";
import setUpStringType from "./String";
import {
  FilterNode,
  KeyValuePairNode,
  ObjectNode,
  ObjectSeparatorNode,
} from "./DataProcessing";
import { DefaultComparisonOperatorGrammarRule } from "./DataProcessing/Filter/Grammar/DefaultGrammar/ComparisonOperatorGrammarRule";
import {
  BaseComparisonOperator,
  IFilterComparisonOperatorVisitor,
} from "./DataProcessing/Filter/FilterComparisonOperators";
import * as parserGenerator from "peggy";

import { IdentifierGrammarRule } from "./DataProcessing/Filter/Grammar/DefaultGrammar/IdentifierGrammarRule";
import { NumberGrammarRule } from "./DataProcessing/Filter/Grammar/DefaultGrammar/NumberGrammarRule";
import { IGrammarRule } from "./DataProcessing/Filter/Grammar/GrammarRule.types";
setUpStringType();

const parser = new FilterQueryParser();
console.log("true && false".length);
const tree = parser.parse("true && false");
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
const comparisonOp = new DefaultComparisonOperatorGrammarRule();
printVisitor.visit(tree);
const identRule = new IdentifierGrammarRule();
const rule =
  identRule.label +
  " = " +
  identRule.ruleAt(0) +
  ` { return options.handleMatch(0,[identifier])}`;
console.log(rule);
const parser1 = parserGenerator.generate(rule);
const tree1: FilterNode<any> = parser1.parse("akshar", {
  handleMatch: identRule.handleMatch.bind(identRule),
});
printVisitor.visit(tree1);
console.log(comparisonOp);
const grammars: IGrammarRule<any, any>[] = [comparisonOp, identRule];
