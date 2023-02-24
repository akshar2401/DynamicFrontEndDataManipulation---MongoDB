import { Errors } from "../../Common/";

export interface IComparisonOperator
  extends IVisitorComptabileComparisonOperator<any> {
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

  public abstract accept(visitor: IFilterComparisonOperatorVisitor<any>);
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

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitGreaterThanEqualTo(this);
  }
}

export class LessThanEqualTo extends BinaryOperator {
  constructor() {
    super("<=");
  }

  protected _evaluate(a: any, b: any) {
    return a <= b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitLessThanEqualTo(this);
  }
}

export class EqualTo extends BinaryOperator {
  constructor() {
    super("==");
  }

  protected _evaluate(a: any, b: any) {
    return a == b;
  }
  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitEqualTo(this);
  }
}

export class StrictEqualTo extends BinaryOperator {
  constructor() {
    super("===");
  }

  protected _evaluate(a: any, b: any) {
    return a === b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitStrictEqualTo(this);
  }
}

export class StrictNotEqualTo extends BinaryOperator {
  constructor() {
    super("!==");
  }

  protected _evaluate(a: any, b: any) {
    return a !== b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitStrictNotEqualTo(this);
  }
}

export class NotEqualTo extends BinaryOperator {
  constructor() {
    super("!=");
  }

  protected _evaluate(a: any, b: any) {
    return a != b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitNotEqualTo(this);
  }
}

export class LessThan extends BinaryOperator {
  constructor() {
    super("<");
  }

  protected _evaluate(a: any, b: any) {
    return a < b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitLessThan(this);
  }
}

export class GreaterThan extends BinaryOperator {
  constructor() {
    super(">");
  }

  protected _evaluate(a: any, b: any) {
    return a > b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitGreaterThan(this);
  }
}

export class In extends BinaryOperator {
  constructor() {
    super("in");
  }

  protected _evaluate(a: any, b: any) {
    return a in b;
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitIn(this);
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

export interface IFilterComparisonOperatorVisitor<ReturnType> {
  visit(operator: IComparisonOperator): ReturnType;
  visitGreaterThanEqualTo(operator: GreaterThanEqualTo): ReturnType;
  visitGreaterThan(operator: GreaterThan): ReturnType;
  visitLessThan(operator: LessThan): ReturnType;
  visitEqualTo(operator: EqualTo): ReturnType;
  visitStrictEqualTo(operator: StrictEqualTo): ReturnType;
  visitNotEqualTo(operator: NotEqualTo): ReturnType;
  visitStrictNotEqualTo(operator: StrictNotEqualTo): ReturnType;
  visitLessThanEqualTo(operator: LessThanEqualTo): ReturnType;
  visitIn(operator: In): ReturnType;
}

export interface IVisitorComptabileComparisonOperator<ReturnType> {
  accept(visitor: IFilterComparisonOperatorVisitor<ReturnType>): ReturnType;
}
