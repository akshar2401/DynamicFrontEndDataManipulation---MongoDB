import { Errors } from "../Errors";
import { Utilities } from "../Utilities";

export type GrammarProductionEmitOptions = {
  indent?: number;
  indentRules?: number;
};

export type AddRuleOptions = {
  index?: number;
  modifyRuleToRecognizeSpaces?: boolean;
};

export class GrammarNode {
  private _rules: string[] = [];
  private _childLabels = new Set<string>();
  private _children: GrammarNode[] = [];
  constructor(public readonly label: string) {
    Errors.throwIfEmptyOrNullOrUndefined(label, "Grammar Rule Label");
  }

  addRule(rule: string, options?: AddRuleOptions) {
    options ??= {
      index: -1,
      modifyRuleToRecognizeSpaces: false,
    };

    if (options.modifyRuleToRecognizeSpaces) {
      rule = Utilities.modifyGrammarToRecognizeSpaces(rule);
    }

    Errors.throwIfNullOrUndefined(rule, String.join("Rule for ", this.label));
    if (options.index < 0 || options.index >= this.ruleCount) {
      this._rules.push(rule);
    } else {
      this._rules.splice(options.index, 0, rule);
    }
  }

  addChild(child: GrammarNode, index = -1) {
    Errors.throwIfNullOrUndefined(
      child,
      String.join("Child node for ", this.label)
    );
    if (this._childLabels.has(child.label)) {
      return;
    }

    if (index < 0 || index >= this.childrenCount) {
      this._children.push(child);
    } else {
      this._children.splice(index, 0, child);
    }

    this._childLabels.add(child.label);
  }

  public get rules() {
    return this._getRules();
  }

  public get ruleCount() {
    return this._rules.length;
  }

  public ruleAt(index: number) {
    return Utilities.isValidIndex(index, this.ruleCount)
      ? this._rules[index]
      : undefined;
  }

  public get children() {
    return this._getChildren();
  }

  public get childrenCount() {
    return this._children.length;
  }
  public childrenAt(index: number) {
    return Utilities.isValidIndex(index, this.childrenCount)
      ? this._children[index]
      : undefined;
  }

  private *_getChildren() {
    for (const child of this._children) {
      yield child;
    }
  }
  private *_getRules() {
    for (const rule of this.rules) {
      yield rule;
    }
  }

  public emit(options?: GrammarProductionEmitOptions): string {
    options ??= {
      indent: 0,
      indentRules: 4,
    };
    const production: string[] = [];
    production.push(
      String.join(String.repeat(String.Space, options.indent), this.label)
    );
    this._rules.forEach((rule, index) => {
      production.push(
        String.join(
          String.repeat(String.Space, options.indent + options.indentRules),
          index === 0
            ? String.Punctuations.Equals
            : String.Punctuations.ForwardSlash,
          String.Space,
          rule
        )
      );
    });

    return production.join(String.Newline);
  }
  public static createEmptyRule(label: string) {
    return new GrammarNode(label);
  }
}

export class GrammarBuilder {}
