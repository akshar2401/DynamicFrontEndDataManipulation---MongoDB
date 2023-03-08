import { Errors, Queue, Utilities } from "../../../../Common";
import {
  findAllRuleReferences,
  findRuleReferences,
  getLabelsFromRule,
} from "../Functionalities";
import { IGrammarRule } from "../GrammarRule.types";
import { IGrammarBuilder } from "./Builder.types";

export class BaseGrammarBuilder implements IGrammarBuilder {
  protected grammarRulesByLabel = new Map<string, IGrammarRule[]>();
  protected grammarRulesById = new Map<string, IGrammarRule>();
  protected _startGrammarRule: IGrammarRule = undefined;
  protected _startGrammarRulesCache = new Set<string>();
  protected _orderedStartGrammarRules: string[] = [];

  public get startGrammarRules() {
    return this._startGrammarRules();
  }

  private *_startGrammarRules() {
    for (const grammarRule of this._orderedStartGrammarRules) {
      yield grammarRule;
    }
  }

  public get grammars() {
    return this._grammars();
  }

  private *_grammars() {
    const grammarRulesQueue = new Queue<string>();
    const visitedLabels = new Set<string>();
    for (const startGrammarRule of this.startGrammarRules) {
      grammarRulesQueue.enqueue(startGrammarRule);
      visitedLabels.add(startGrammarRule);
    }

    while (!grammarRulesQueue.isEmpty) {
      const currentGrammarLabel = grammarRulesQueue.dequeue();
      const currentGrammarRules =
        this.getGrammarRulesByLabel(currentGrammarLabel);
      for (const currentGrammarRule of currentGrammarRules) {
        yield currentGrammarRule;
        for (const reference of findAllRuleReferences(currentGrammarRule)) {
          if (!visitedLabels.has(reference)) {
            visitedLabels.add(reference);
            grammarRulesQueue.enqueue(reference);
          }
        }
      }
    }
  }

  addRule(grammarRule: IGrammarRule): void {
    if (!this.grammarRulesById.has(grammarRule.id)) {
      let grammarRulesForCurrentLabel: IGrammarRule[] = [];
      const label = grammarRule.label;
      if (!this.grammarRulesByLabel.has(label)) {
        this.grammarRulesByLabel.set(label, grammarRulesForCurrentLabel);
      } else {
        grammarRulesForCurrentLabel = this.grammarRulesByLabel.get(label);
      }
      grammarRulesForCurrentLabel.push(grammarRule);
      this.grammarRulesById.set(grammarRule.id, grammarRule);
      if (grammarRule.isStartRule && !this._startGrammarRulesCache.has(label)) {
        this._orderedStartGrammarRules.push(label);
        this._startGrammarRulesCache.add(label);
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
    for (const grammarRule of this.grammars) {
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
