import { IGrammarRule } from "../GrammarRule.types";

export interface IGrammarBuilder {
  addRule(grammarRule: IGrammarRule): void;
  emitGrammar(): string;
  startGrammarRule: IGrammarRule;
  getGrammarRulesByLabel<GrammarRuleType extends IGrammarRule = IGrammarRule>(
    label: string
  ): GrammarRuleType[];
  getGrammarRuleByLabel<GrammarRuleType extends IGrammarRule = IGrammarRule>(
    label: string
  ): GrammarRuleType | undefined;
  getGrammarRuleById<GrammarRuleType extends IGrammarRule = IGrammarRule>(
    id: string
  ): GrammarRuleType;
}
