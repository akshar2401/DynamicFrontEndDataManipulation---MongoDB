import { Errors } from "../../../../Errors";
import {
  getInBuiltComparisonOperators,
  IComparisonOperator,
} from "../../FilterComparisonOperators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type ComparisonOperatorRuleMatchReturnType = IComparisonOperator;
type ComparisonOperatorRuleArgs = any;

export class ComparisonOperatorGrammarRule extends GrammarRuleWithMultipleChildRules<
  ComparisonOperatorRuleArgs,
  ComparisonOperatorRuleMatchReturnType
> {
  private readonly _operators = new Map<string, IComparisonOperator>();
  constructor() {
    super(DefaultGrammarRuleLabel.ComparisonOperatorRule);
  }
  public override addRule(_: string): void {
    Errors.throwNotSupportedError(
      "Adding custom rule",
      "for " + ComparisonOperatorGrammarRule.name
    );
  }

  public override get rules(): string[] {
    return Array.from(this.operators)
      .sort(
        (operator1, operator2) => operator1.precedence - operator2.precedence
      )
      .map((operator) => operator.operator.surroundWithQuotes());
  }

  public addOperator(operator: IComparisonOperator) {
    Errors.throwIfNullOrUndefined(operator, "Operator");
    Errors.throwIfEmptyOrNullOrUndefined(operator.operator, "Operator Name");
    if (this._operators.has(operator.operator)) {
      return;
    }

    this._operators.set(operator.operator, operator);
  }

  public get operators() {
    return this._yieldOperators();
  }

  private *_yieldOperators() {
    for (const operator of this._operators.values()) {
      yield operator;
    }
  }

  protected handleMatchInternal(
    ruleIndex: number
  ): ComparisonOperatorRuleMatchReturnType {
    const operatorName = this.rules[ruleIndex].trim(
      String.Punctuations.DoubleQuote
    );
    if (!this._operators.has(operatorName)) {
      Errors.throwIfInvalid(
        () => true,
        operatorName,
        `${operatorName} operator`
      );
    }
    return this._operators.get(operatorName);
  }
}

export class DefaultComparisonOperatorGrammarRule extends ComparisonOperatorGrammarRule {
  constructor() {
    super();
    for (const operator of getInBuiltComparisonOperators()) {
      super.addOperator(operator);
    }
  }
}
