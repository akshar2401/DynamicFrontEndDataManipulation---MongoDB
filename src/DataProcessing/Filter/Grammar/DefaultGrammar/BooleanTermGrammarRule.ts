import {
  BinaryLogicalOperationNode,
  FilterNode,
  UnaryOperationNode,
} from "../../FilterNode";
import { NodeCreatorAdditionalArguments } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type BooleanTermGrammarRuleMatchReturnType =
  | UnaryOperationNode
  | BinaryLogicalOperationNode
  | FilterNode<any>;
type BooleanTermGrammarRuleFirstRuleMatchArgs = [
  FilterNode<any>,
  NodeCreatorAdditionalArguments | undefined
];
type BooleanTermGrammarRuleSecondRuleMatchArgs = [
  operator: string,
  lhs: BooleanTermGrammarRuleMatchReturnType,
  additionalArgs: NodeCreatorAdditionalArguments | undefined
];
type BooleanTermGrammarRuleThirdRuleMatchArgs = [
  node: BinaryLogicalOperationNode,
  additionalArgs: NodeCreatorAdditionalArguments | undefined
];
type BooleanTermGrammarRuleMatchArgs =
  | BooleanTermGrammarRuleFirstRuleMatchArgs
  | BooleanTermGrammarRuleSecondRuleMatchArgs
  | BooleanTermGrammarRuleThirdRuleMatchArgs;

export class BooleanTermGrammarRule extends GrammarRuleWithMultipleChildRules<
  BooleanTermGrammarRuleMatchArgs,
  BooleanTermGrammarRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.BooleanTermRule, [
      "terminal",
      'op:"!" expr:booleanTerm',
      '"(" expr:logicalOr ")"',
    ]);
  }
  protected override handleMatchInternal(
    ruleIndex: number,
    args: BooleanTermGrammarRuleMatchArgs
  ): BooleanTermGrammarRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return (args as BooleanTermGrammarRuleFirstRuleMatchArgs)[0];
      case 1:
        return NodeCreators.createUnaryOperationNode(
          ...(args as BooleanTermGrammarRuleSecondRuleMatchArgs)
        );
      case 2:
        return NodeCreators.handleInParenthesis(
          ...(args as BooleanTermGrammarRuleThirdRuleMatchArgs)
        );
    }
  }
}
