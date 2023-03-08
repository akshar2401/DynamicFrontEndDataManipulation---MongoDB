import { NodeCreatorAdditionalArguments } from "../NodeCreator.types";

export interface IGrammarRule<MatchArgTypes = any[], ReturnType = any> {
  label: string;
  id: string;
  rules: string[];
  numberOfRules: number;
  ruleAt(index: number): string;
  handleMatch(ruleIndex: number, args: MatchArgTypes): ReturnType;
  addRule(rule: string): void;
  shouldEmitAction(ruleIndex: number): boolean;
  isStartRule: boolean;
}

export type HandleMatchAdditionalArgsType =
  | NodeCreatorAdditionalArguments
  | undefined;
