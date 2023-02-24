import {
  BinaryLogicalOperationNode,
  FilterNode,
  UnaryOperationNode,
} from "../../FilterNode";
import { NodeCreatorAdditionalArguments } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

export type BooleanTermGrammarRuleMatchReturnType =
  | UnaryOperationNode
  | BinaryLogicalOperationNode
  | FilterNode<any>;
type BooleanTermGrammarRuleFirstRuleMatchArgs = [
  FilterNode<any>,
  HandleMatchAdditionalArgsType
];
type BooleanTermGrammarRuleSecondRuleMatchArgs = [
  operator: string,
  lhs: BooleanTermGrammarRuleMatchReturnType,
  additionalArgs: HandleMatchAdditionalArgsType
];
type BooleanTermGrammarRuleThirdRuleMatchArgs = [
  node: BinaryLogicalOperationNode,
  additionalArgs: HandleMatchAdditionalArgsType
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
      DefaultGrammarRuleLabel.TerminalRule,
      `op:"!" expr:${DefaultGrammarRuleLabel.BooleanTermRule}`,
      `"(" expr:${DefaultGrammarRuleLabel.LogicalOrRule} ")"`,
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
