import { Utilities } from "../../../../Utilities";
import { ObjectNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { TerminalObjectRuleMatchReturnType } from "./TerminalObjectGrammarRule";

export type TerminalObjectLiteralRuleMatchFirstArgType = [
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

  protected override shouldEmitActionInternal(ruleIndex: number): boolean {
    return ruleIndex > 0;
  }

  protected handleMatchInternal(
    ruleIndex: number,
    args: TerminalObjectLiteralRuleMatchArgs
  ): TerminalObjectLiteralRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createObjectNode(
          undefined,
          (args as TerminalObjectLiteralRuleMatchFirstArgType)[0]
        );
      case 1:
        return NodeCreators.createObjectNode(
          ...(args as TerminalObjectLiteralRuleMatchSecondArgType)
        );
    }
  }
}
