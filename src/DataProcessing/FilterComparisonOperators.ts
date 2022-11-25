export interface IComparisonOperator {
  operator: string;
  get precedence(): number;
}

export class BaseComparisonOperator implements IComparisonOperator {
  public operator: string;
  constructor(operator: string) {
    this.operator = operator;
  }

  get precedence(): number {
    // operator with more characters should come first
    return -this.operator.length;
  }
}

export class GreaterThanEqualTo extends BaseComparisonOperator {
  constructor() {
    super(">=");
  }
}

export class LessThanEqualTo extends BaseComparisonOperator {
  constructor() {
    super("<=");
  }
}

export class EqualTo extends BaseComparisonOperator {
  constructor() {
    super("==");
  }
}

export class StrictEqualTo extends BaseComparisonOperator {
  constructor() {
    super("===");
  }
}

export class StrictNotEqualTo extends BaseComparisonOperator {
  constructor() {
    super("!==");
  }
}

export class NotEqualTo extends BaseComparisonOperator {
  constructor() {
    super("!=");
  }
}

export class LessThan extends BaseComparisonOperator {
  constructor() {
    super("<");
  }
}

export class GreaterThan extends BaseComparisonOperator {
  constructor() {
    super(">");
  }
}

export class In extends BaseComparisonOperator {
  constructor() {
    super("in");
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
