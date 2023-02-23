import { Utilities } from "../../../../Utilities";
import { BinaryLogicalOperationNode } from "../../FilterNode";
import { NodeCreatorAdditionalArguments } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { ConditionRuleMatchReturnType } from "./ConditionGrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

type LogicalAndActionFirstRuleParamTypes = [
  lhs: ConditionRuleMatchReturnType,
  op: string,
  rhs: LogicalAndRuleMatchReturnType,
  additionalArgs: NodeCreatorAdditionalArguments | undefined
];
type LogicalAndActionSecondRuleParamTypes = [
  ConditionRuleMatchReturnType,
  NodeCreatorAdditionalArguments | undefined
];
type LogicalAndActionParamTypes =
  | LogicalAndActionFirstRuleParamTypes
  | LogicalAndActionSecondRuleParamTypes;

export type LogicalAndRuleMatchReturnType =
  | BinaryLogicalOperationNode
  | ConditionRuleMatchReturnType;

export class LogicalAndGrammarRule extends GrammarRuleWithMultipleChildRules<
  LogicalAndActionParamTypes,
  LogicalAndRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.LogicalAndRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        'lhs:condition op:"&&" rhs:logicalAnd'
      ),
      "condition",
    ]);
  }
  protected override handleMatchInternal(
    ruleIndex: number,
    args: LogicalAndActionParamTypes
  ): LogicalAndRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createBinaryLogicalOperationNode(
          ...(args as LogicalAndActionFirstRuleParamTypes)
        );
      case 1:
        return (args as LogicalAndActionSecondRuleParamTypes)[0];
    }
  }
}
