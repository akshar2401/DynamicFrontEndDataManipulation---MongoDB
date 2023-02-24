import { Utilities } from "../../../../Utilities";
import { ObjectSeparatorNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { TerminalObjectKeyValuePairRuleMatchReturnType } from "./TerminalKeyValuePairGrammarRule";

export type TerminalObjectRuleMatchFirstArgType = [
  lhs: TerminalObjectKeyValuePairRuleMatchReturnType,
  sep: string,
  rhs: TerminalObjectRuleMatchReturnType,
  additionalArgs: HandleMatchAdditionalArgsType
];

export type TerminalObjectRuleMatchSecondArgType = [
  TerminalObjectKeyValuePairRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];

export type TerminalObjectRuleMatchArgs =
  | TerminalObjectRuleMatchFirstArgType
  | TerminalObjectRuleMatchSecondArgType;

export type TerminalObjectRuleMatchReturnType =
  | TerminalObjectKeyValuePairRuleMatchReturnType
  | ObjectSeparatorNode;

export class TerminalObjectGrammarRule extends GrammarRuleWithMultipleChildRules<
  TerminalObjectRuleMatchArgs,
  TerminalObjectRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.TerminalObjectRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        `lhs:${DefaultGrammarRuleLabel.TerimalObjectKeyValuePairRule} sep:"," rhs:${DefaultGrammarRuleLabel.TerminalObjectRule}`
      ),
      DefaultGrammarRuleLabel.TerimalObjectKeyValuePairRule,
    ]);
  }
  protected handleMatchInternal(
    ruleIndex: number,
    args: TerminalObjectRuleMatchArgs
  ): TerminalObjectRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createObjectSeparatorNode(
          ...(args as TerminalObjectRuleMatchFirstArgType)
        );
      case 1:
        return (args as TerminalObjectRuleMatchSecondArgType)[0];
    }
  }
}
