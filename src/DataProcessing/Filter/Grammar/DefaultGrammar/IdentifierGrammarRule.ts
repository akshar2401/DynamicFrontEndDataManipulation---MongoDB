import { IdentifierNode } from "../../FilterNode";
import { TokenType } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRule } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type IdentifierRuleMatchArgs = [
  TokenType,
  HandleMatchAdditionalArgsType
];
export type IdentifierRuleMatchReturnType = IdentifierNode;

export class IdentifierGrammarRule extends GrammarRule<
  IdentifierRuleMatchArgs,
  IdentifierRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.IdentifierRule, [
      'identifier:([^ 0-9->=(){}!<&|:,"\\[\\]] ([^->=!<()&|:{},"\\]\\[ ]*))',
    ]);
  }
  protected handleMatchInternal(
    _: number,
    args: IdentifierRuleMatchArgs
  ): IdentifierRuleMatchReturnType {
    return NodeCreators.createIdentifierNode(...args);
  }
}
