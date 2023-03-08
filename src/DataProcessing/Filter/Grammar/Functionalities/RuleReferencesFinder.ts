import { Utilities } from "../../../../Common";
import { IGrammarRule } from "../GrammarRule.types";
import * as parserGenerator from "peggy";
import { RuleRefNodesFinderVisitor } from "../Visitors";

export function findRuleReferences(
  rule: IGrammarRule,
  subrule: string
): string[] {
  if (Utilities.isNullOrUndefined(rule)) {
    return [];
  }

  const correctedRule = rule.label + " = " + subrule;
  if (Utilities.isNotEmptyString(subrule)) {
    try {
      const grammarTree = parserGenerator.parser.parse(correctedRule);
      const ruleReferencesFindorVisitor = new RuleRefNodesFinderVisitor();
      ruleReferencesFindorVisitor.visit(grammarTree);
      return ruleReferencesFindorVisitor.matchedNodes.map((node) => node.name);
    } catch {
      return [];
    }
  }
  return [];
}
export function* findAllRuleReferences(rule: IGrammarRule) {
  if (!Utilities.isNullOrUndefined(rule)) {
    const referencesCache = new Set<string>();
    for (const subrule of rule.rules) {
      for (const ruleRef of findRuleReferences(rule, subrule)) {
        if (!referencesCache.has(ruleRef)) {
          yield ruleRef;
          referencesCache.add(ruleRef);
        }
      }
    }
  }
}
