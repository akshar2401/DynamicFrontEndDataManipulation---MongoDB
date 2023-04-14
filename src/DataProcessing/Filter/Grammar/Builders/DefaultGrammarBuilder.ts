import { BaseGrammarBuilder } from ".";
import { DefaultGrammarRuleLabel } from "../DefaultGrammar";
import { BooleanGrammarRule } from "../DefaultGrammar/BooleanGrammarRule";
import { BooleanTermGrammarRule } from "../DefaultGrammar/BooleanTermGrammarRule";
import {
  ComparisonOperatorGrammarRule,
  DefaultComparisonOperatorGrammarRule,
} from "../DefaultGrammar/ComparisonOperatorGrammarRule";
import { ConditionGrammarRule } from "../DefaultGrammar/ConditionGrammarRule";
import { IdentifierGrammarRule } from "../DefaultGrammar/IdentifierGrammarRule";
import { LogicalAndGrammarRule } from "../DefaultGrammar/LogicalAndGrammarRule";
import { LogicalOrGrammarRule } from "../DefaultGrammar/LogicalOrGrammarRule";
import { NumberGrammarRule } from "../DefaultGrammar/NumberGrammarRule";
import { StartGrammarRule } from "../DefaultGrammar/StartGrammarRule";
import { StringGrammarRule } from "../DefaultGrammar/StringGrammarRule";
import { TerminalGrammarRule } from "../DefaultGrammar/TerminalGrammarRule";
import { TerminalObjectKeyValuePairGrammarRule } from "../DefaultGrammar/TerminalKeyValuePairGrammarRule";
import { TerminalListGrammarRule } from "../DefaultGrammar/TerminalListGrammarRule";
import { TerminalListLiteralGrammarRule } from "../DefaultGrammar/TerminalListLiteralGrammarRule";
import { TerminalObjectGrammarRule } from "../DefaultGrammar/TerminalObjectGrammarRule";
import { TerminalObjectLiteralGrammarRule } from "../DefaultGrammar/TerminalObjectLiteralGrammarRule";

export class DefaultGrammarBuilder extends BaseGrammarBuilder {
  constructor() {
    super();
    super.addRules(
      new NumberGrammarRule(),
      new LogicalAndGrammarRule(),
      new ConditionGrammarRule(),
      new DefaultComparisonOperatorGrammarRule(),
      new BooleanTermGrammarRule(),
      new LogicalOrGrammarRule(),
      new TerminalGrammarRule(),
      new TerminalObjectLiteralGrammarRule(),
      new TerminalObjectGrammarRule(),
      new TerminalObjectKeyValuePairGrammarRule(),
      new TerminalListLiteralGrammarRule(),
      new TerminalListGrammarRule(),
      new BooleanGrammarRule(),
      new StringGrammarRule(),
      new IdentifierGrammarRule(),
      new StartGrammarRule()
    );
  }

  get numberGrammarRule() {
    return this.getGrammarRuleByLabel<NumberGrammarRule>(
      DefaultGrammarRuleLabel.NumberRule
    );
  }

  get logicalAndGrammarRule() {
    return this.getGrammarRuleByLabel<LogicalAndGrammarRule>(
      DefaultGrammarRuleLabel.LogicalAndRule
    );
  }

  get conditionGrammarRule() {
    return this.getGrammarRuleByLabel<ConditionGrammarRule>(
      DefaultGrammarRuleLabel.ConditionRule
    );
  }

  get comparisonGrammarRule() {
    return this.getGrammarRuleByLabel<ComparisonOperatorGrammarRule>(
      DefaultGrammarRuleLabel.ComparisonOperatorRule
    );
  }
}
