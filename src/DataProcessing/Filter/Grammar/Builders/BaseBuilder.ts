import { Errors, Queue, Utilities } from "../../../../Common";
import { BaseEmitter } from "../Emitters/BaseEmitter";
import { IGrammarEmitter } from "../Emitters/Emitter.types";
import { findAllRuleReferences } from "../Functionalities";
import { IGrammarRule } from "../GrammarRule.types";
import { IGrammarBuilder } from "./Builder.types";

export class BaseGrammarBuilder implements IGrammarBuilder {
  protected grammarRulesByLabel = new Map<string, IGrammarRule[]>();
  protected grammarRulesById = new Map<string, IGrammarRule>();
  protected _startGrammarRule: IGrammarRule = undefined;
  protected _startGrammarRulesCache = new Set<string>();
  protected _orderedStartGrammarRules: string[] = [];

  constructor(protected readonly grammarEmitter?: IGrammarEmitter) {
    this.grammarEmitter ??= new BaseEmitter();
  }
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
    return this.grammarEmitter.emitGrammar(this.grammars);
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
    if (!Utilities.isValidIndex(0, grammarRules.length)) {
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

  As<GrammarBuilderType extends IGrammarBuilder>() {
    return this as unknown as GrammarBuilderType;
  }
}
