import { Utilities } from "../../../../Utilities";
import { BinaryLogicalOperationNode } from "../../FilterNode";
import { NodeCreatorAdditionalArguments } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { LogicalAndRuleMatchReturnType } from "./LogicalAndGrammarRule";

type LogicalOrActionFirstRuleParamTypes = [
  lhs: LogicalAndRuleMatchReturnType,
  op: string,
  rhs: LogicalOrRuleMatchReturnType,
  additionalArgs: NodeCreatorAdditionalArguments | undefined
];
type LogicalOrActionSecondRuleParamTypes = [
  LogicalAndRuleMatchReturnType,
  NodeCreatorAdditionalArguments | undefined
];
type LogicalOrActionParamTypes =
  | LogicalOrActionFirstRuleParamTypes
  | LogicalOrActionSecondRuleParamTypes;

export type LogicalOrRuleMatchReturnType =
  | BinaryLogicalOperationNode
  | LogicalAndRuleMatchReturnType;

export class LogicalOrGrammarRule extends GrammarRuleWithMultipleChildRules<
  LogicalOrActionParamTypes,
  LogicalOrRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.LogicalOrRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        'lhs:logicalAnd op:"||" rhs:logicalOr'
      ),
      "logicalAnd",
    ]);
  }
  protected override handleMatchInternal(
    ruleIndex: number,
    args: LogicalOrActionParamTypes
  ): LogicalOrRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createBinaryLogicalOperationNode(
          ...(args as LogicalOrActionFirstRuleParamTypes)
        );
      case 1:
        return (args as LogicalOrActionSecondRuleParamTypes)[0];
    }
  }
}
