export interface IComparisonOperator
  extends IVisitorCompatibleComparisonOperator<any> {
  readonly operator: string;
  get precedence(): number;
  readonly key: string;
}

export abstract class BaseComparisonOperator implements IComparisonOperator {
  public readonly operator: string;
  constructor(operator: string) {
    this.operator = operator;
  }

  get precedence(): number {
    // operator with more characters should come first
    return -this.operator.length;
  }

  public abstract accept(visitor: IFilterComparisonOperatorVisitor<any>);

  public get key() {
    return this.operator;
  }
}

export abstract class BinaryOperator extends BaseComparisonOperator {
  constructor(operator: string) {
    super(operator);
  }
}

export class GreaterThanEqualTo extends BinaryOperator {
  constructor() {
    super(">=");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitGreaterThanEqualTo(this);
  }
}

export class LessThanEqualTo extends BinaryOperator {
  constructor() {
    super("<=");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitLessThanEqualTo(this);
  }
}

export class EqualTo extends BinaryOperator {
  constructor() {
    super("==");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitEqualTo(this);
  }
}

export class StrictEqualTo extends BinaryOperator {
  constructor() {
    super("===");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitStrictEqualTo(this);
  }
}

export class StrictNotEqualTo extends BinaryOperator {
  constructor() {
    super("!==");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitStrictNotEqualTo(this);
  }
}

export class NotEqualTo extends BinaryOperator {
  constructor() {
    super("!=");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitNotEqualTo(this);
  }
}

export class LessThan extends BinaryOperator {
  constructor() {
    super("<");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitLessThan(this);
  }
}

export class GreaterThan extends BinaryOperator {
  constructor() {
    super(">");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitGreaterThan(this);
  }
}

export class In extends BinaryOperator {
  constructor() {
    super("in");
  }

  public accept(visitor: IFilterComparisonOperatorVisitor<any>) {
    return visitor.visitIn(this);
  }
}

export function getBuiltInComparisonOperators() {
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

export interface IVisitorCompatibleComparisonOperator<ReturnType> {
  accept(visitor: IFilterComparisonOperatorVisitor<ReturnType>): ReturnType;
}
