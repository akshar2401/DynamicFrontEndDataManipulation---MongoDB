import { IGrammarRule } from "../GrammarRule.types";

export interface IGrammarEmitter {
  emitGrammar(grammar: Iterable<IGrammarRule>): string;
}
