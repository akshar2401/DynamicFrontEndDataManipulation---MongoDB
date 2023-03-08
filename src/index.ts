import { PrintFilterTreeVisitor } from "./DataProcessing/Filter/Visitors";
import GeneralFilterSplitter from "./DataProcessing/Filter/GeneralFilterSplitter";
import { setUpStringType } from "./Common";
import {
  BaseFilterQueryParser,
  ConditionNode,
  FilterNode,
  IdentifierNode,
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
import { DefaultGrammarBuilder } from "./DataProcessing/Filter/Grammar";
import { IQueryConverter, PythonFilterQueryConverter } from "./QueryConverters";
import { IFilterQueryConverter } from "./QueryConverters/FilterQueryConverter";
const deque = require("collections/deque");

setUpStringType();
// const builder = new DefaultGrammarBuilder();
// console.log(builder.emitGrammar());

const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
const expr =
  '(((x)) !== "ss" && (1 > 2 || true && false || u in {u:1, "asssss": c, "list": [1,2,3,{}]}))';
const parser = new BaseFilterQueryParser();
const tree = parser.parse(expr);
printVisitor.visit(tree);
