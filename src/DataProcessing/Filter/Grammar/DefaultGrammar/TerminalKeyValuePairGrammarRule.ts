import { Utilities } from "../../../../Common";
import { KeyValuePairNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRule } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { IdentifierRuleMatchReturnType } from "./IdentifierGrammarRule";
import { NumberRuleMatchReturnType } from "./NumberGrammarRule";
import { StringRuleMatchReturnType } from "./StringGrammarRule";
import { TerminalRuleMatchReturnType } from "./TerminalGrammarRule";

export type TerminalObjectKeyValuePairRuleMatchArg = [
  key:
    | IdentifierRuleMatchReturnType
    | StringRuleMatchReturnType
    | NumberRuleMatchReturnType,
  sep: string,
  value: TerminalRuleMatchReturnType,
  additonalArgs: HandleMatchAdditionalArgsType
];

export type TerminalObjectKeyValuePairRuleMatchReturnType = KeyValuePairNode;

export class TerminalObjectKeyValuePairGrammarRule extends GrammarRule<
  TerminalObjectKeyValuePairRuleMatchArg,
  TerminalObjectKeyValuePairRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.TerimalObjectKeyValuePairRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        `key:(${DefaultGrammarRuleLabel.IdentifierRule}/${DefaultGrammarRuleLabel.StringRule}/${DefaultGrammarRuleLabel.NumberRule}) sep:":" value:${DefaultGrammarRuleLabel.TerminalRule}`
      ),
    ]);
  }

  protected handleMatchInternal(
    _: number,
    args: TerminalObjectKeyValuePairRuleMatchArg
  ): TerminalObjectKeyValuePairRuleMatchReturnType {
    return NodeCreators.createKeyValuePairNode(...args);
  }
}
