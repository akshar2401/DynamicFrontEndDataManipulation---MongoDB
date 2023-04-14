import { PrintFilterTreeVisitor } from "./DataProcessing/Filter/Visitors";
import { setUpStringType } from "./Common";
import { BaseFilterQueryParser } from "./DataProcessing";
import { PythonFilterQueryConverter } from "./QueryConverters";
import {
  BaseComparisonOperator,
  BaseGrammarBuilder,
  ComparisonOperatorGrammarRule,
  DefaultGrammarBuilder,
  DefaultGrammarRuleLabel,
  IFilterComparisonOperatorVisitor,
  In,
} from "./DataProcessing/Filter";

setUpStringType();
// const builder = new DefaultGrammarBuilder();
// console.log(builder.emitGrammar());

interface IExtendedComparisonOperatorVisitor<ReturnType = any>
  extends IFilterComparisonOperatorVisitor<ReturnType> {
  visitOf(ofOperator: OfOperator): ReturnType;
  visitExactIn(exactIn: ExactIn): ReturnType;
}

class OfOperator extends BaseComparisonOperator {
  constructor() {
    super("of");
  }
  public accept(visitor: IExtendedComparisonOperatorVisitor) {
    return visitor.visitOf(this);
  }
}

class ExactIn extends BaseComparisonOperator {
  constructor() {
    super("exactin");
  }

  public accept(visitor: IExtendedComparisonOperatorVisitor) {
    return visitor.visitExactIn(this);
  }
}

const printVisitor = new PrintFilterTreeVisitor({ printOutput: true });
const expr =
  '(((x)) !== "ss" && (1 > 2 || true && false || u exactin {u:1, "asssss": c, "list": [1,2,3,{}]}))';
const parser = new BaseFilterQueryParser();
parser.grammarBuilder
  .As<DefaultGrammarBuilder>()
  .comparisonGrammarRule.addOperator(new OfOperator())
  .addOperator(new ExactIn());
const tree = parser.parse(expr);
console.log(tree);
printVisitor.visit(tree);
console.log(parser.grammarBuilder.emitGrammar());
