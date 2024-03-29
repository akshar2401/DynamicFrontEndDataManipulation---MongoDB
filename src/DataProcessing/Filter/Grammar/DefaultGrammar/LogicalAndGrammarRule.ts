import { Utilities } from "../../../../Common";
import { BinaryLogicalOperationNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRule } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { ConditionRuleMatchReturnType } from "./ConditionGrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

type LogicalAndActionFirstRuleParamTypes = [
  lhs: ConditionRuleMatchReturnType,
  op: string,
  rhs: LogicalAndRuleMatchReturnType,
  additionalArgs: HandleMatchAdditionalArgsType
];
type LogicalAndActionSecondRuleParamTypes = [
  ConditionRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];
export type LogicalAndActionParamTypes =
  | LogicalAndActionFirstRuleParamTypes
  | LogicalAndActionSecondRuleParamTypes;

export type LogicalAndRuleMatchReturnType =
  | BinaryLogicalOperationNode
  | ConditionRuleMatchReturnType;

export class LogicalAndGrammarRule extends GrammarRule<
  LogicalAndActionParamTypes,
  LogicalAndRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.LogicalAndRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        `lhs:${DefaultGrammarRuleLabel.ConditionRule} op:"&&" rhs:${DefaultGrammarRuleLabel.LogicalAndRule}`
      ),
      DefaultGrammarRuleLabel.ConditionRule,
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
