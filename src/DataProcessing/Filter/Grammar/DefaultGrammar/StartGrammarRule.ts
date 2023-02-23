import { BinaryLogicalOperationNode } from "../../FilterNode";
import { NodeCreatorAdditionalArguments } from "../../NodeCreator.types";
import { GrammarRule } from "../GrammarRule";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { LogicalOrRuleMatchReturnType } from "./LogicalOrGrammarRule";

export class StartGrammarRule extends GrammarRule<
  [LogicalOrRuleMatchReturnType, NodeCreatorAdditionalArguments | undefined],
  LogicalOrRuleMatchReturnType
> {
  constructor() {
    super(DefaultGrammarRuleLabel.StartRule, ["logicalOr"]);
  }

  handleMatch(
    _: number,
    args: [
      LogicalOrRuleMatchReturnType,
      NodeCreatorAdditionalArguments | undefined
    ]
  ): LogicalOrRuleMatchReturnType {
    return args[0];
  }
}
