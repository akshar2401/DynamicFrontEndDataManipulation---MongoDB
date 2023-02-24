import { Errors, Utilities } from "../../../../Common";
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
    throw new Error("Method not implemented.");
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
    if (Utilities.isValidIndex(0, grammarRules.length - 1)) {
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
