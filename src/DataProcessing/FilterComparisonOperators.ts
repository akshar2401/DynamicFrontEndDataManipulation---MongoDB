import { Errors } from "../Errors";

export interface IComparisonOperator {
  operator: string;
  get precedence(): number;
  evaluate(...args: any[]): any;
}

export abstract class BaseComparisonOperator implements IComparisonOperator {
  public operator: string;
  constructor(operator: string) {
    this.operator = operator;
  }

  get precedence(): number {
    // operator with more characters should come first
    return -this.operator.length;
  }

  public abstract evaluate(...args: any[]);
}

export abstract class BinaryOperator extends BaseComparisonOperator {
  constructor(operator: string) {
    super(operator);
  }

  public evaluate(...args: any[]) {
    Errors.throwIfNotAtLeastSize(args, 2);
    return this._evaluate(args[0], args[1]);
  }

  protected abstract _evaluate(a: any, b: any): any;
}

export class GreaterThanEqualTo extends BinaryOperator {
  constructor() {
    super(">=");
  }
  protected _evaluate(a, b) {
    return a >= b;
  }
}

export class LessThanEqualTo extends BinaryOperator {
  constructor() {
    super("<=");
  }

  protected _evaluate(a: any, b: any) {
    return a <= b;
  }
}

export class EqualTo extends BinaryOperator {
  constructor() {
    super("==");
  }

  protected _evaluate(a: any, b: any) {
    return a == b;
  }
}

export class StrictEqualTo extends BinaryOperator {
  constructor() {
    super("===");
  }

  protected _evaluate(a: any, b: any) {
    return a === b;
  }
}

export class StrictNotEqualTo extends BinaryOperator {
  constructor() {
    super("!==");
  }

  protected _evaluate(a: any, b: any) {
    return a !== b;
  }
}

export class NotEqualTo extends BinaryOperator {
  constructor() {
    super("!=");
  }

  protected _evaluate(a: any, b: any) {
    return a != b;
  }
}

export class LessThan extends BinaryOperator {
  constructor() {
    super("<");
  }

  protected _evaluate(a: any, b: any) {
    return a < b;
  }
}

export class GreaterThan extends BinaryOperator {
  constructor() {
    super(">");
  }

  protected _evaluate(a: any, b: any) {
    return a > b;
  }
}

export class In extends BinaryOperator {
  constructor() {
    super("in");
  }

  protected _evaluate(a: any, b: any) {
    return a in b;
  }
}

export function getInBuiltComparisonOperators() {
  return [
    new GreaterThanEqualTo(),
    new GreaterThan(),
    new LessThan(),
    new EqualTo(),
    new StrictEqualTo(),
    new NotEqualTo(),
    new StrictNotEqualTo(),
    new LessThanEqualTo(),
    new In(),
  ];
}
