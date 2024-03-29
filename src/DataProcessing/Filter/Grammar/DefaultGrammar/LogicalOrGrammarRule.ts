import { Utilities } from "../../../../Common";
import { BinaryLogicalOperationNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRule } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { LogicalAndRuleMatchReturnType } from "./LogicalAndGrammarRule";

type LogicalOrActionFirstRuleParamTypes = [
  lhs: LogicalAndRuleMatchReturnType,
  op: string,
  rhs: LogicalOrRuleMatchReturnType,
  additionalArgs: HandleMatchAdditionalArgsType
];
type LogicalOrActionSecondRuleParamTypes = [
  LogicalAndRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];
export type LogicalOrActionParamTypes =
  | LogicalOrActionFirstRuleParamTypes
  | LogicalOrActionSecondRuleParamTypes;

export type LogicalOrRuleMatchReturnType =
  | BinaryLogicalOperationNode
  | LogicalAndRuleMatchReturnType;

export class LogicalOrGrammarRule extends GrammarRule<
  LogicalOrActionParamTypes,
  LogicalOrRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.LogicalOrRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        `lhs:${DefaultGrammarRuleLabel.LogicalAndRule} op:"||" rhs:${DefaultGrammarRuleLabel.LogicalOrRule}`
      ),
      DefaultGrammarRuleLabel.LogicalAndRule,
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
