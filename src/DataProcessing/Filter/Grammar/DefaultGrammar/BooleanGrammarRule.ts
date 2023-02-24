import { BooleanLiteralNode } from "../../FilterNode";
import { TokenType } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type BooleanRuleMatchArgs = [TokenType, HandleMatchAdditionalArgsType];
export type BooleanRuleMatchReturnType = BooleanLiteralNode;

export class BooleanGrammarRule extends GrammarRuleWithMultipleChildRules<
  BooleanRuleMatchArgs,
  BooleanRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.BooleanRule, [
      `boolLiteral: ("true" / "false")`,
    ]);
  }
  protected handleMatchInternal(
    _: number,
    args: BooleanRuleMatchArgs
  ): BooleanRuleMatchReturnType {
    return NodeCreators.createBoolNode(...args);
  }
}
