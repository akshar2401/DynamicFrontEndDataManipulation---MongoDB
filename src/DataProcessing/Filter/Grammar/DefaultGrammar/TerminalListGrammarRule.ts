import { Utilities } from "../../../../Utilities";
import { ListSeparatorNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { TerminalRuleMatchReturnType } from "./TerminalGrammarRule";

export type TerminalListRuleMatchFirstArgType = [
  lhs: TerminalRuleMatchReturnType,
  sep: string,
  rhs: TerminalListRuleMatchReturnType,
  additionalArgs: HandleMatchAdditionalArgsType
];

export type TerminalListRuleMatchSecondArgType = [
  TerminalRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];

export type TerminalListRuleMatchArgs =
  | TerminalListRuleMatchFirstArgType
  | TerminalListRuleMatchSecondArgType;

export type TerminalListRuleMatchReturnType =
  | TerminalRuleMatchReturnType
  | ListSeparatorNode;

export class TerminalListGrammarRule extends GrammarRuleWithMultipleChildRules<
  TerminalListRuleMatchArgs,
  TerminalListRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.TerminalListRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        `lhs:${DefaultGrammarRuleLabel.TerminalRule} sep:"," rhs:terminalList`
      ),
      DefaultGrammarRuleLabel.TerminalRule,
    ]);
  }
  protected handleMatchInternal(
    ruleIndex: number,
    args: TerminalListRuleMatchArgs
  ): TerminalListRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createListSeparatorNode(
          ...(args as TerminalListRuleMatchFirstArgType)
        );
      case 1:
        return (args as TerminalListRuleMatchSecondArgType)[0];
    }
  }
}
