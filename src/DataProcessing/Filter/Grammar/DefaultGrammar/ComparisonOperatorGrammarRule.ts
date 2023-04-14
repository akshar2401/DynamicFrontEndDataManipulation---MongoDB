import { Errors, Utilities } from "../../../../Common";
import {
  getBuiltInComparisonOperators,
  IComparisonOperator,
} from "../../FilterComparisonOperators";
import { GrammarRule } from "../GrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";

export type ComparisonOperatorRuleMatchReturnType = IComparisonOperator;
export type ComparisonOperatorRuleArgs = [
  string,
  HandleMatchAdditionalArgsType
];

export class ComparisonOperatorGrammarRule extends GrammarRule<
  ComparisonOperatorRuleArgs,
  ComparisonOperatorRuleMatchReturnType
> {
  private readonly _operators = new Map<string, IComparisonOperator>();
  private _orderedOperators: string[] = undefined;

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
    if (Utilities.isNullOrUndefined(this._orderedOperators)) {
      this._orderedOperators = Array.from(this._operators.values())
        .sort((op1, op2) => op1.precedence - op2.precedence)
        .map((operator) => operator.operator.surroundWithQuotes());
    }
    return this._orderedOperators;
  }

  public override get numberOfRules() {
    return this._operators.size;
  }

  public override ruleAt(index: number): string {
    Errors.throwIfOutOfBounds(
      index,
      0,
      this.numberOfRules - 1,
      "Rules of " + this.label
    );
    return this.rules[index];
  }

  public addOperator(operator: IComparisonOperator) {
    Errors.throwIfNullOrUndefined(operator, "Operator");
    Errors.throwIfEmptyOrNullOrUndefined(operator.operator, "Operator Name");
    if (this._operators.has(operator.key)) {
      return;
    }
    this._orderedOperators = undefined;
    this._operators.set(operator.key, operator);
    return this;
  }

  public removeOperator(operator: IComparisonOperator) {
    if (Utilities.isNullOrUndefined(operator)) {
      return;
    }

    this._orderedOperators = undefined;
    this._operators.delete(operator.key);
    return this;
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
    _: number,
    args: ComparisonOperatorRuleArgs
  ): ComparisonOperatorRuleMatchReturnType {
    const operatorName = args[0];
    Errors.throwIfInvalid(
      (operatorName: string) => !this._operators.has(operatorName),
      operatorName,
      `${operatorName} operator`
    );
    return this._operators.get(operatorName);
  }
}

export class DefaultComparisonOperatorGrammarRule extends ComparisonOperatorGrammarRule {
  constructor() {
    super();
    for (const operator of getBuiltInComparisonOperators()) {
      super.addOperator(operator);
    }
  }
}
