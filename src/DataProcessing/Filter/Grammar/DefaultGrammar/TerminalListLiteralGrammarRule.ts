import { Utilities } from "../../../../Utilities";
import { ListNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { TerminalListRuleMatchReturnType } from "./TerminalListGrammarRule";

export type TerminalListLiteralRuleMatchFirstArgType = [
  HandleMatchAdditionalArgsType
];

export type TerminalListLiteralRuleMatchSecondArgType = [
  TerminalListRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];

export type TerminalListLiteralRuleMatchArgs =
  | TerminalListLiteralRuleMatchFirstArgType
  | TerminalListLiteralRuleMatchSecondArgType;

export type TerminalListLiteralRuleMatchReturnType = ListNode;

export class TerminalListLiteralGrammarRule extends GrammarRuleWithMultipleChildRules<
  TerminalListLiteralRuleMatchArgs,
  TerminalListLiteralRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.TerminalListLiteralRule, [
      Utilities.modifyGrammarToRecognizeSpaces('"[" "]"'),
      Utilities.modifyGrammarToRecognizeSpaces(
        `"[" list:${DefaultGrammarRuleLabel.TerminalListRule} "]"`
      ),
    ]);
  }

  protected override shouldEmitActionInternal(ruleIndex: number): boolean {
    return ruleIndex > 0;
  }

  protected handleMatchInternal(
    ruleIndex: number,
    args: TerminalListLiteralRuleMatchArgs
  ): TerminalListLiteralRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createListNode(
          undefined,
          (args as TerminalListLiteralRuleMatchFirstArgType)[0]
        );
      case 1:
        return NodeCreators.createListNode(
          ...(args as TerminalListLiteralRuleMatchSecondArgType)
        );
    }
  }
}
