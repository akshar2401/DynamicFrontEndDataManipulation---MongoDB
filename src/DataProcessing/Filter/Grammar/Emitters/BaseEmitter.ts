import { getLabelsFromRule } from "../Functionalities";
import { IGrammarRule } from "../GrammarRule.types";
import { IGrammarEmitter } from "./Emitter.types";

export class BaseEmitter implements IGrammarEmitter {
  emitGrammar(grammars: Iterable<IGrammarRule>): string {
    const emittedGrammar: string[] = [];
    let currentLabel: string;
    let emittedRulesForCurrentLabel = 0;
    for (const grammarRule of grammars) {
      if (!currentLabel || currentLabel !== grammarRule.label) {
        emittedRulesForCurrentLabel = 0;
        emittedGrammar.push(this.emitLabel(grammarRule.label, !currentLabel));
        currentLabel = grammarRule.label;
      }
      for (
        let ruleIndex = 0;
        ruleIndex < grammarRule.numberOfRules;
        ruleIndex++
      ) {
        emittedGrammar.push(
          this.emitRule(
            ruleIndex,
            grammarRule,
            emittedRulesForCurrentLabel === 0
          )
        );
        emittedRulesForCurrentLabel++;
      }
    }
    return emittedGrammar.join(String.Empty);
  }

  protected emitLabel(label: string, firstLabel = false) {
    return String.join(firstLabel ? String.Empty : String.Newline, label);
  }

  protected emitRule(
    ruleIndex: number,
    grammarRule: IGrammarRule,
    firstRule = false
  ) {
    const emittedRule = [];
    const rule = grammarRule.ruleAt(ruleIndex);
    emittedRule.push(
      firstRule
        ? String.join(
            String.Newline,
            String.Tab,
            String.Punctuations.Equals,
            String.Space
          )
        : String.join(
            String.Newline,
            String.Tab,
            String.Punctuations.ForwardSlash,
            String.Space
          )
    );
    if (grammarRule.shouldEmitAction(ruleIndex)) {
      const labels = getLabelsFromRule(grammarRule.label, rule);
      if (labels.length === 0) {
        emittedRule.push(grammarRule.label);
        emittedRule.push(String.Punctuations.Colon);
        emittedRule.push(String.Brackets.Opening.Round);
        emittedRule.push(rule);
        emittedRule.push(String.Brackets.Closing.Round);
        labels.push(grammarRule.label);
      } else {
        emittedRule.push(rule);
      }
      emittedRule.push(String.Space);
      emittedRule.push(String.Brackets.Opening.Curly);
      emittedRule.push(String.Space);
      emittedRule.push(
        `return options.handleMatch("${
          grammarRule.id
        }", ${ruleIndex}, [${labels.join(
          String.Punctuations.Comma + String.Space
        )}, {span: range()}])`
      );
      emittedRule.push(String.Space);
      emittedRule.push(String.Brackets.Closing.Curly);
    } else {
      emittedRule.push(rule);
    }
    return emittedRule.join(String.Empty);
  }
}
