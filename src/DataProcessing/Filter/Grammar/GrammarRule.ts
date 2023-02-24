import { Errors } from "../../../Errors";
import { IGrammarRule } from "./GrammarRule.types";

export abstract class GrammarRule<MatchArgTypes, ReturnType>
  implements IGrammarRule<MatchArgTypes, ReturnType>
{
  private static _counter = 1;
  public readonly id: string;
  protected _rules: string[];
  public readonly children: IGrammarRule<any, any>[] = [];
  constructor(public readonly label: string, rules: string[] = []) {
    Errors.throwIfEmptyOrNullOrUndefined(label, "Label");
    this.id = GrammarRule._counter.toString();
    GrammarRule._counter++;
    this._rules = Array.from(rules || []);
  }
  public addRule(rule: string) {
    Errors.throwIfNullOrUndefined(rule, `Rule for ${this.label}`);
    this._rules.push(rule);
  }

  public get rules() {
    return this._rules;
  }

  public get numberOfRules() {
    return this._rules.length;
  }

  public ruleAt(index: number): string {
    Errors.throwIfOutOfBounds(
      index,
      0,
      this.numberOfRules - 1,
      "Rules of " + this.label
    );
    return this._rules[index];
  }

  public addChild(child: IGrammarRule<any, any>): void {
    Errors.throwIfNullOrUndefined(child, `Child of ${this.label}`);
    this.children.push(child);
  }

  abstract handleMatch(ruleIndex: number, args: MatchArgTypes): ReturnType;
}

export abstract class GrammarRuleWithMultipleChildRules<
  MatchArgTypes,
  ReturnType
> extends GrammarRule<MatchArgTypes, ReturnType> {
  handleMatch(ruleIndex: number, args: MatchArgTypes): ReturnType {
    Errors.throwIfOutOfBounds(
      ruleIndex,
      0,
      this.numberOfRules - 1,
      "Rules of " + this.label
    );
    return this.handleMatchInternal(ruleIndex, args);
  }

  protected abstract handleMatchInternal(
    ruleIndex: number,
    args: MatchArgTypes
  ): ReturnType;
}
