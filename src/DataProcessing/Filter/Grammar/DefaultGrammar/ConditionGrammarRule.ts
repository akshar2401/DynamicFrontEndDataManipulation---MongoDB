import { Utilities } from "../../../../Common";
import { ConditionNode } from "../../FilterNode";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { BooleanTermGrammarRuleMatchReturnType } from "./BooleanTermGrammarRule";
import { ComparisonOperatorRuleMatchReturnType } from "./ComparisonOperatorGrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

type ConditionActionFirstRuleParamTypes = [
  lhs: BooleanTermGrammarRuleMatchReturnType,
  op: ComparisonOperatorRuleMatchReturnType,
  rawOperatorToken: string,
  rhs: ConditionRuleMatchReturnType,
  additionalArgs: HandleMatchAdditionalArgsType
];
type ConditionActionSecondRuleParamTypes = [
  BooleanTermGrammarRuleMatchReturnType,
  HandleMatchAdditionalArgsType
];
type ConditionActionParamTypes =
  | ConditionActionFirstRuleParamTypes
  | ConditionActionSecondRuleParamTypes;

export type ConditionRuleMatchReturnType =
  | ConditionNode
  | BooleanTermGrammarRuleMatchReturnType;

export class ConditionGrammarRule extends GrammarRuleWithMultipleChildRules<
  ConditionActionParamTypes,
  ConditionRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.ConditionRule, [
      Utilities.modifyGrammarToRecognizeSpaces(
        `lhs:${DefaultGrammarRuleLabel.BooleanTermRule} op:${DefaultGrammarRuleLabel.ComparisonOperatorRule} rhs:${DefaultGrammarRuleLabel.ConditionRule}`
      ),
      DefaultGrammarRuleLabel.BooleanTermRule,
    ]);
  }
  protected override handleMatchInternal(
    ruleIndex: number,
    args: ConditionActionParamTypes
  ): ConditionRuleMatchReturnType {
    switch (ruleIndex) {
      case 0:
        return NodeCreators.createConditionNode(
          ...(args as ConditionActionFirstRuleParamTypes)
        );
      case 1:
        return (args as ConditionActionSecondRuleParamTypes)[0];
    }
  }
}
