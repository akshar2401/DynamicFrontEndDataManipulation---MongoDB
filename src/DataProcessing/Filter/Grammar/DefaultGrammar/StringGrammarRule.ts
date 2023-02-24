import { StringLiteralNode } from "../../FilterNode";
import { TokenType } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type StringRuleMatchArgs = [TokenType, HandleMatchAdditionalArgsType];
export type StringRuleMatchReturnType = StringLiteralNode;

export class StringGrammarRule extends GrammarRuleWithMultipleChildRules<
  StringRuleMatchArgs,
  StringRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.StringRule, [
      `stringLiteral:('"' [^"]* '"')`,
    ]);
  }
  protected handleMatchInternal(
    _: number,
    args: StringRuleMatchArgs
  ): StringRuleMatchReturnType {
    return NodeCreators.createStringNode(...args);
  }
}
