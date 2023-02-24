import { Utilities } from "../../../../Common";
import { ObjectNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { TerminalObjectRuleMatchReturnType } from "./TerminalObjectGrammarRule";

export type TerminalObjectLiteralRuleMatchFirstArgType = [
  any,
  HandleMatchAdditionalArgsType
];

export type TerminalObjectLiteralRuleMatchSecondArgType = [
  TerminalObjectRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];

export type TerminalObjectLiteralRuleMatchArgs =
  | TerminalObjectLiteralRuleMatchFirstArgType
  | TerminalObjectLiteralRuleMatchSecondArgType;

export type TerminalObjectLiteralRuleMatchReturnType = ObjectNode;

export class TerminalObjectLiteralGrammarRule extends GrammarRuleWithMultipleChildRules<
  TerminalObjectLiteralRuleMatchArgs,
  TerminalObjectLiteralRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.TerminalObjectLiteralRule, [
      Utilities.modifyGrammarToRecognizeSpaces('"{" "}"'),
      Utilities.modifyGrammarToRecognizeSpaces(
        `"{" object:${DefaultGrammarRuleLabel.TerminalObjectRule} "}"`
      ),
    ]);
  }

  protected handleMatchInternal(
    ruleIndex: number,
    args: TerminalObjectLiteralRuleMatchArgs
  ): TerminalObjectLiteralRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createObjectNode(
          undefined,
          (args as TerminalObjectLiteralRuleMatchFirstArgType)[1]
        );
      case 1:
        return NodeCreators.createObjectNode(
          ...(args as TerminalObjectLiteralRuleMatchSecondArgType)
        );
    }
  }
}
