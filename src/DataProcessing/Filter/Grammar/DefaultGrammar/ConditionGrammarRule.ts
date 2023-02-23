import { Utilities } from "../../../../Utilities";
import { ConditionNode } from "../../FilterNode";
import { NodeCreatorAdditionalArguments } from "../../NodeCreator.types";
import { NodeCreators } from "../../NodeCreators";
import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { BooleanTermGrammarRuleMatchReturnType } from "./BooleanTermGrammarRule";
import { ComparisonOperatorRuleMatchReturnType } from "./ComparisonOperatorGrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";

type ConditionActionFirstRuleParamTypes = [
  lhs: BooleanTermGrammarRuleMatchReturnType,
  op: string,
  rhs: ConditionRuleMatchReturnType,
  additionalArgs: NodeCreatorAdditionalArguments | undefined
];
type ConditionActionSecondRuleParamTypes = [
  BooleanTermGrammarRuleMatchReturnType,
  NodeCreatorAdditionalArguments | undefined
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
        "lhs:booleanTerm op:comparisonOp rhs:condition"
      ),
      "booleanTerm",
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
