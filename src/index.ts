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

const parser = new FilterQueryParser();
console.log("1 > 2 || true && false".length);
const tree = parser.parse(
  '1 > 2 || true && false || u in {u:1, "asssss": c, "list": []}'
);
const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
printVisitor.visit(tree);
const g = parser.getGrammar();
const gt = parserGenerator.parser.parse(g);
console.log(getLabels(gt));
const builder = new DefaultGrammarBuilder();
console.log(builder.startGrammarRule);
