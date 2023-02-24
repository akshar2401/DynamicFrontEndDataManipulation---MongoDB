import { GrammarRuleWithMultipleChildRules } from "../GrammarRule";
import { HandleMatchAdditionalArgsType } from "../GrammarRule.types";
import { DefaultGrammarRuleLabel } from "./DefaultGrammarLabels";
import { LogicalOrRuleMatchReturnType } from "./LogicalOrGrammarRule";

export class StartGrammarRule extends GrammarRuleWithMultipleChildRules<
  [LogicalOrRuleMatchReturnType, HandleMatchAdditionalArgsType],
  LogicalOrRuleMatchReturnType
> {
  constructor() {
    super(
      DefaultGrammarRuleLabel.StartRule,
      [DefaultGrammarRuleLabel.LogicalOrRule],
      true
    );
  }

  protected handleMatchInternal(
    _: number,
    args: [LogicalOrRuleMatchReturnType, HandleMatchAdditionalArgsType]
  ): LogicalOrRuleMatchReturnType {
    return args[0];
  }
}
