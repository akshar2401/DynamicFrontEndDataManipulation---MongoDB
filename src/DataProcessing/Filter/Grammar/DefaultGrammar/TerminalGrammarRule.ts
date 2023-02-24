import { ListSeparatorNode } from "../../FilterNode";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { BooleanRuleMatchReturnType } from "./BooleanGrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { NumberRuleMatchReturnType } from "./NumberGrammarRule";
import { StringRuleMatchReturnType } from "./StringGrammarRule";
import { TerminalListLiteralRuleMatchReturnType } from "./TerminalListLiteralGrammarRule";

export type TerminalRuleMatchArgType = [
  TerminalRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];
export type TerminalRuleMatchReturnType =
  | BooleanRuleMatchReturnType
  | NumberRuleMatchReturnType
  | StringRuleMatchReturnType
  | TerminalListLiteralRuleMatchReturnType;

export class TerminalGrammarRule extends GrammarRuleWithMultipleChildRules<
  TerminalRuleMatchArgType,
  TerminalRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.TerminalRule, [
      DefaultGrammarRuleLabel.BooleanRule,
      DefaultGrammarRuleLabel.NumberRule,
      DefaultGrammarRuleLabel.StringRule,
      DefaultGrammarRuleLabel.IdentifierRule,
      DefaultGrammarRuleLabel.TerminalListLiteralRule,
      DefaultGrammarRuleLabel.TerminalObjectLiteralRule,
    ]);
  }
  protected handleMatchInternal(
    _: number,
    args: TerminalRuleMatchArgType
  ): TerminalRuleMatchReturnType {
    return args[0];
  }
}
