import { Errors } from "../../../../Errors";
import {
  getInBuiltComparisonOperators,
  IComparisonOperator,
} from "../../FilterComparisonOperators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import SortedSet = require("collections/sorted-set");

export type ComparisonOperatorRuleMatchReturnType = IComparisonOperator;
type ComparisonOperatorRuleArgs = any;

export class ComparisonOperatorGrammarRule extends GrammarRuleWithMultipleChildRules<
  ComparisonOperatorRuleArgs,
  ComparisonOperatorRuleMatchReturnType
> {
  private readonly _operators = new Map<string, IComparisonOperator>();
  private readonly _sortedRules = new SortedSet<string>(
    [],
    (operatorName1, operatorName2) => {
      return operatorName1 === operatorName2;
    },
    (operatorName1, operatorName2) => {
      const operator1 = this._operators.get(operatorName1);
      const operator2 = this._operators.get(operatorName2);
      let compareValue = operator1.precedence - operator2.precedence;
      if (compareValue === 0) {
        compareValue = operatorName1 > operatorName2 ? -1 : 1;
      }
      return compareValue;
    }
  );
  private _convertSortedRules = true;
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
    if (this._convertSortedRules) {
      this._rules = this._sortedRules.map((rule: string) =>
        rule.surroundWithQuotes()
      );
      this._convertSortedRules = false;
    }
    return this._rules;
  }

  public override get numberOfRules() {
    return this._sortedRules.length;
  }

  public override ruleAt(index: number): string {
    Errors.throwIfOutOfBounds(
      index,
      0,
      this.numberOfRules - 1,
      "Rules of " + this.label
    );
    return this._sortedRules.slice(index, index + 1)[0];
  }

  public addOperator(operator: IComparisonOperator) {
    Errors.throwIfNullOrUndefined(operator, "Operator");
    Errors.throwIfEmptyOrNullOrUndefined(operator.operator, "Operator Name");
    if (this._operators.has(operator.operator)) {
      return;
    }

    this._operators.set(operator.operator, operator);
    this._sortedRules.add(operator.operator);
    this._convertSortedRules = true;
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
    const operatorName = this.ruleAt(ruleIndex);
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
