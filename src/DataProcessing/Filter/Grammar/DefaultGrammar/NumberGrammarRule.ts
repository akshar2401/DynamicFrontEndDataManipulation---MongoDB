import { FilterNode } from "../../FilterNode";
import { TokenType } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRule } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type NumberRuleMatchArgs = [TokenType, HandleMatchAdditionalArgsType];
export type NumberRuleMatchReturnType = FilterNode<number>;

export class NumberGrammarRule extends GrammarRule<
  NumberRuleMatchArgs,
  NumberRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.NumberRule, [
      `float:(("-"[0-9]+ "." [0-9]*) / ([0-9]+ "." [0-9]*))`,
      `integer:([0-9]+ / "-"[0-9]+)`,
    ]);
  }
  protected handleMatchInternal(
    ruleIndex: number,
    args: NumberRuleMatchArgs
  ): NumberRuleMatchReturnType {
    return NodeCreators.createNumberNode(
      args[0],
      /*isFloat*/ ruleIndex === 0,
      args[1]
    );
  }
}
