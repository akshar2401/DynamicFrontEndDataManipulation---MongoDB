import FilterQueryParser from "./DataProcessing/Filter/Filter";
import { PrintFilterTreeVisitor } from "./DataProcessing/Filter/Visitors";
import GeneralFilterSplitter from "./DataProcessing/Filter/GeneralFilterSplitter";
import { setUpStringType } from "./Common";
import {
  ConditionNode,
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
import {
  DefaultGrammarBuilder,
  getLabels,
} from "./DataProcessing/Filter/Grammar";

setUpStringType();

const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
const builder = new DefaultGrammarBuilder();
console.log(builder.emitGrammar());
const parser1 = parserGenerator.generate(builder.emitGrammar(), {
  cache: true,
});
const options = {
  handleMatch(id: string, ruleIndex: number, args: any[]) {
    return builder.getGrammarRuleById(id).handleMatch(ruleIndex, args);
  },
};
const expr =
  '(((x)) == "ss" && (1 > 2 || true && false || u in {u:1, "asssss": c, "list": []}))';

const tree: FilterNode<any> = parser1.parse(expr, options);
printVisitor.visit(tree);
console.log(expr.length);
console.log(tree.firstChild.firstChild);
console.log(tree.firstChild.firstChild.spanWithoutAccountingParenthesis);
