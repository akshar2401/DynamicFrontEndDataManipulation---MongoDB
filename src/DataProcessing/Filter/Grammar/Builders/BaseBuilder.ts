import { Errors, Utilities } from "../../../../Common";
import { getLabels, getLabelsFromRule } from "../Functionalities";
import { IGrammarRule } from "../GrammarRule.types";
import { IGrammarBuilder } from "./Builder.types";

export class BaseGrammarBuilder implements IGrammarBuilder {
  protected grammarRulesByLabel = new Map<string, IGrammarRule[]>();
  protected grammarRulesById = new Map<string, IGrammarRule>();
  protected orderedGrammars: IGrammarRule[] = [];
  protected _startGrammarRule: IGrammarRule = undefined;

  public get startGrammarRule() {
    return this._startGrammarRule;
  }

  public set startGrammarRule(rule: IGrammarRule) {
    Errors.throwIfInvalid(
      (grammarRule: IGrammarRule) =>
        !this.grammarRulesById.has(grammarRule.id) ||
        !this.grammarRulesByLabel.has(grammarRule.label) ||
        !grammarRule.isStartRule,
      rule,
      "Start Grammar Rule with label " + rule.label + " and id" + rule.id
    );
    this._startGrammarRule = rule;
  }

  addRule(grammarRule: IGrammarRule): void {
    if (!this.grammarRulesById.has(grammarRule.id)) {
      this.orderedGrammars.push(grammarRule);
      let grammarRulesForCurrentLabel: IGrammarRule[] = [];
      const label = grammarRule.label;
      if (!this.grammarRulesByLabel.has(label)) {
        this.grammarRulesByLabel.set(label, grammarRulesForCurrentLabel);
      } else {
        grammarRulesForCurrentLabel = this.grammarRulesByLabel.get(label);
      }
      grammarRulesForCurrentLabel.push(grammarRule);
      this.grammarRulesById.set(grammarRule.id, grammarRule);
      if (grammarRule.isStartRule) {
        this._startGrammarRule = grammarRule;
      }
    }
  }

  addRules(...grammarRules: IGrammarRule[]): void {
    for (const rule of grammarRules) {
      this.addRule(rule);
    }
  }

  emitGrammar(): string {
    const emittedGrammar: string[] = [];
    let currentLabel: string;
    let emittedRulesForCurrentLabel = 0;
    for (const grammarRule of this.orderedGrammars) {
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

  private emitLabel(label: string, firstLabel = false) {
    return String.join(firstLabel ? "" : "\n", label);
  }
  private emitRule(
    ruleIndex: number,
    grammarRule: IGrammarRule,
    firstRule = false
  ) {
    const emittedRule = [];
    const rule = grammarRule.ruleAt(ruleIndex);
    emittedRule.push(firstRule ? "\n\t= " : "\n\t/ ");
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

  getGrammarRulesByLabel<
    GrammarRuleType extends IGrammarRule<any[], any> = IGrammarRule<any[], any>
  >(label: string): GrammarRuleType[] {
    if (!this.grammarRulesByLabel.has(label)) {
      return [];
    }
    return this.grammarRulesByLabel.get(label) as GrammarRuleType[];
  }
  getGrammarRuleByLabel<
    GrammarRuleType extends IGrammarRule<any[], any> = IGrammarRule<any[], any>
  >(label: string): GrammarRuleType {
    if (!this.grammarRulesByLabel.has(label)) {
      return;
    }

    const grammarRules = this.grammarRulesByLabel.get(label);
    if (Utilities.isValidIndex(0, grammarRules.length)) {
      return;
    }

    return grammarRules[0] as GrammarRuleType;
  }
  getGrammarRuleById<
    GrammarRuleType extends IGrammarRule<any[], any> = IGrammarRule<any[], any>
  >(id: string): GrammarRuleType {
    Errors.throwIfInvalid(
      (id) => !this.grammarRulesById.has(id),
      id,
      id + " grammar rule id"
    );
    return this.grammarRulesById.get(id) as GrammarRuleType;
  }
}
