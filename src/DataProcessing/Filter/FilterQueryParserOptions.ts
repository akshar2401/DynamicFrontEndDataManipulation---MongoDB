import { Errors, Utilities } from "../../Common";
import { IFilterQueryParserOptions } from "./FilterParser.types";
import { IGrammarBuilder } from "./Grammar";

export class BaseFilterQueryParserOptions implements IFilterQueryParserOptions {
  constructor(public readonly grammarBuilder: IGrammarBuilder) {
    Errors.throwIfNullOrUndefined(
      this.grammarBuilder,
      "Grammar Builder in BaseFilterQueryParserOptions"
    );
  }
  handleMatch(ruleId: string, ruleIndex: number, args: any[]) {
    const grammarRuleWithGivenId =
      this.grammarBuilder.getGrammarRuleById(ruleId);
    if (Utilities.isNotNullOrUndefined(grammarRuleWithGivenId)) {
      return grammarRuleWithGivenId.handleMatch(ruleIndex, args);
    }
  }
}
