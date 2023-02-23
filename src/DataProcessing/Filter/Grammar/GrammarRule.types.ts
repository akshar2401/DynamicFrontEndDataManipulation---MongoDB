export interface IGrammarRule<MatchArgTypes, ReturnType> {
  label: string;
  id: string;
  rules: string[];
  children: IGrammarRule<any, any>[];
  handleMatch(ruleIndex: number, args: MatchArgTypes): ReturnType;
  addRule(rule: string): void;
  addChild(child: IGrammarRule<any, any>): void;
}
