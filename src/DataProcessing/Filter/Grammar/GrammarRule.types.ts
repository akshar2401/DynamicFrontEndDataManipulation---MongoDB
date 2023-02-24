import { NodeCreatorAdditionalArguments } from "../NodeCreator.types";

export interface IGrammarRule<MatchArgTypes = any[], ReturnType = any> {
  label: string;
  id: string;
  rules: string[];
  children: IGrammarRule<any, any>[];
  numberOfRules: number;
  ruleAt(index: number): string;
  handleMatch(ruleIndex: number, args: MatchArgTypes): ReturnType;
  addRule(rule: string): void;
  shouldEmitAction(ruleIndex: number): boolean;
  isStartRule: boolean;
  addChild(child: IGrammarRule<any, any>): void;
}

export type HandleMatchAdditionalArgsType =
  | NodeCreatorAdditionalArguments
  | undefined;
