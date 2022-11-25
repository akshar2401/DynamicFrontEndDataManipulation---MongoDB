import { ErrorMessages } from "../ErrorMessages";
import { Utilities } from "../Utilities";
import type {
  IFilterNodeVisitor,
  IVisitorComptabileFilterNode,
} from "./Visitors";

export enum FilterNodeType {
  Integer = "integer",
  Float = "float",
  Null = "null",
  Boolean = "boolean",
  String = "string",
  Identifier = "identifier",
  Condition = "condition",
  LogicalOperation = "logical operation",
  NotLogicalOperation = "Not Logical Operation",
}

export enum LogicalOperator {
  AND = "and",
  OR = "or",
}

export enum UnaryOperator {
  NOT = "not",
}
const symbolsToOperators = {
  "&&": LogicalOperator.AND,
  "||": LogicalOperator.OR,
  "!": UnaryOperator.NOT,
};

export abstract class FilterNode<TData>
  implements IVisitorComptabileFilterNode<any>
{
  public abstract type: FilterNodeType;
  protected _children: FilterNode<any>[];
  public abstract data: TData;
  public parenthesisDepth = 0;

  constructor() {
    this._children = [];
  }

  public add(childNode: FilterNode<any>) {
    if (!childNode) {
      return;
    }
    this._children.push(childNode);
  }

  public get children() {
    return this.yieldChildren();
  }

  private *yieldChildren() {
    for (const child in this._children) {
      yield child;
    }
  }

  public abstract accept(visitor: IFilterNodeVisitor<any>);
}

abstract class LeafFilterNode<TData> extends FilterNode<TData> {
  public override add() {
    throw Error(
      ErrorMessages.cannotNotHaveChildrenErrorMessage(this.type + " node")
    );
  }
}

export class NullFilterNode extends LeafFilterNode<null> {
  public type = FilterNodeType.Null;
  public data: null = null;

  public override get children(): Generator<string, void, unknown> {
    throw Error(
      ErrorMessages.cannotNotHaveChildrenErrorMessage(
        FilterNodeType.Null + " node"
      )
    );
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitNullLiteralNode(this);
  }
}

export class IntegerLiteralNode extends LeafFilterNode<number> {
  public type = FilterNodeType.Integer;
  public data: number;
  constructor(data: string | number) {
    super();
    this.data = typeof data === "string" ? parseInt(data) : data;
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitIntegerLiteralNode(this);
  }
}

export class FloatLiteralNode extends LeafFilterNode<number> {
  public type = FilterNodeType.Float;
  public data: number;

  constructor(data: string | number) {
    super();
    this.data = typeof data === "string" ? parseFloat(data) : data;
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitFloatLiteralNode(this);
  }
}

export class StringLiteralNode extends LeafFilterNode<string> {
  public type = FilterNodeType.String;
  public data: string;

  constructor(data: string) {
    super();
    if (!data) {
      this.data = data;
    } else {
      this.data = data.trim('"');
    }
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitStringLiteralNode(this);
  }
}

export class IdentifierNode extends StringLiteralNode {
  public override type = FilterNodeType.Identifier;

  constructor(data: string) {
    super(data);
  }
  public override accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitIdentifierNode(this);
  }
}

export class BooleanLiteralNode extends LeafFilterNode<boolean> {
  public type = FilterNodeType.Boolean;
  public data: boolean;
  constructor(data: string | boolean | any) {
    super();

    if (typeof data === "string") {
      this.data = data.toLowerCase() === "true";
    } else if (typeof data === "boolean") {
      this.data = data;
    } else {
      this.data = !!data;
    }
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitBooleanLiteralNode(this);
  }
}

export type BinaryOperatorNodeData<T> = {
  operator: string;
  rawOperatorToken: string;
  data?: T;
};

export abstract class BinaryFilterNode<TData> extends FilterNode<TData> {
  private leftChild: FilterNode<any>;
  private rightChild: FilterNode<any>;

  constructor(lhs?: FilterNode<any>, rhs?: FilterNode<any>) {
    super();
    if (Utilities.isNotNullOrUndefined(lhs)) {
      this.add(lhs);
      this.leftChild = lhs;
    }
    if (Utilities.isNotNullOrUndefined(rhs)) {
      this.add(rhs);
      this.rightChild = rhs;
    }
  }
  public override add(childNode: FilterNode<any>): void {
    if (this._children.length === 2) {
      throw new Error(
        ErrorMessages.noMoreThanChildrenErrorMessage(this.type + " node", 2)
      );
    }
    super.add(childNode);
  }

  public get left() {
    return (
      this.leftChild ??
      (this._children.length >= 1 ? this._children[0] : undefined)
    );
  }

  public get right() {
    return (
      this.rightChild ??
      (this._children.length >= 2 ? this._children[1] : undefined)
    );
  }
}

export abstract class BinaryOperatorNode<TData> extends BinaryFilterNode<
  BinaryOperatorNodeData<TData>
> {
  public override data: BinaryOperatorNodeData<TData>;
  constructor(
    operator: string,
    rawOperatorToken?: string,
    data?: TData,
    lhs?: FilterNode<any>,
    rhs?: FilterNode<any>
  ) {
    super(lhs, rhs);
    rawOperatorToken ??= operator;
    this.data = {
      operator,
      rawOperatorToken,
      data,
    };
  }
}

export class ConditionNode extends BinaryOperatorNode<any> {
  public override type = FilterNodeType.Condition;

  constructor(operator: string, lhs?: FilterNode<any>, rhs?: FilterNode<any>) {
    super(operator, operator, undefined, lhs, rhs);
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitConditionNode(this);
  }
}

export class LogicalOperationNode extends BinaryOperatorNode<any> {
  public override type = FilterNodeType.LogicalOperation;

  constructor(
    operator: LogicalOperator,
    lhs?: FilterNode<any>,
    rhs?: FilterNode<any>,
    rawOperatorToken?: string
  ) {
    super(operator, rawOperatorToken, undefined, lhs, rhs);
  }

  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitLogicalOperationNode(this);
  }
}

export abstract class UnaryOperationNode extends BinaryOperatorNode<any> {
  public add(childNode: FilterNode<any>): void {
    if (this._children.length === 1) {
      throw new Error(
        ErrorMessages.noMoreThanChildrenErrorMessage(this.type + " node", 1)
      );
    }

    super.add(childNode);
  }

  constructor(
    operator: UnaryOperator,
    rawOperator?: string,
    lhs?: FilterNode<any>
  ) {
    super(operator, rawOperator, undefined, lhs, undefined);
  }

  public get child() {
    return this.left;
  }
}

export class NotLogicalOperationNode extends UnaryOperationNode {
  public type = FilterNodeType.NotLogicalOperation;

  constructor(rawOperatorToken: string, lhs?: FilterNode<any>) {
    super(UnaryOperator.NOT, rawOperatorToken, lhs);
  }
  public accept(visitor: IFilterNodeVisitor<any>) {
    return visitor.visitNotOperationNode(this);
  }
}

export type TokenType = string | (string | string[])[];

export class NodeCreators {
  static createNumberNode(
    tokens: TokenType,
    isFloat?: boolean
  ): FilterNode<number> | NullFilterNode {
    if (Utilities.isNullOrUndefined(tokens) || tokens.length === 0) {
      return new NullFilterNode();
    }
    const token = this.flattenAndJoinTokens(tokens);
    if (Utilities.isNullOrUndefined(isFloat)) {
      isFloat = token.includes(".");
    }
    if (isFloat) {
      return new FloatLiteralNode(token);
    } else {
      return new IntegerLiteralNode(token);
    }
  }

  static createBoolNode(token: TokenType) {
    return new BooleanLiteralNode(token);
  }

  static createStringNode(tokens: TokenType) {
    if (Utilities.isNullOrUndefined(tokens)) {
      return new NullFilterNode();
    }

    return new StringLiteralNode(this.flattenAndJoinTokens(tokens));
  }

  static createIdentifierNode(tokens: TokenType) {
    let token: string;
    if (
      Utilities.isNullOrUndefined(tokens) ||
      Utilities.isEmptyString((token = this.flattenAndJoinTokens(tokens)))
    ) {
      return new NullFilterNode();
    }

    return new IdentifierNode(token);
  }

  static createConditionNode(
    lhs: FilterNode<any>,
    operator: string,
    rhs: FilterNode<any>
  ) {
    return new ConditionNode(operator, lhs, rhs);
  }

  static createLogicalOperationNode(
    lhs: FilterNode<any>,
    operator: string,
    rhs: FilterNode<any>
  ) {
    return new LogicalOperationNode(
      symbolsToOperators[operator],
      lhs,
      rhs,
      operator
    );
  }

  static createUnaryOperationNode(operator: string, lhs: FilterNode<any>) {
    const unaryOp: UnaryOperator = symbolsToOperators[operator];
    switch (unaryOp) {
      case UnaryOperator.NOT:
        return new NotLogicalOperationNode(operator, lhs);
      default:
        return new NullFilterNode();
    }
  }

  static handleInParenthesis(node: FilterNode<any>) {
    node.parenthesisDepth++;
    return node;
  }
  private static flattenAndJoinTokens(tokens: TokenType): string {
    if (typeof tokens === "string") {
      return tokens;
    } else {
      const result = tokens.map((token) => this.flattenAndJoinTokens(token));
      return result.join(String.Empty);
    }
  }
}

export const ParserOptions = {
  NullFilterNode,
  FloatLiteralNode,
  IntegerLiteralNode,
  BooleanLiteralNode,
  StringLiteralNode,
  IdentifierNode,
  ConditionNode,
  LogicalOperationNode,
  NotLogicalOperationNode,
  createBoolNode: NodeCreators.createBoolNode.bind(NodeCreators),
  createStringNode: NodeCreators.createStringNode.bind(NodeCreators),
  createNumberNode: NodeCreators.createNumberNode.bind(NodeCreators),
  createIdentifierNode: NodeCreators.createIdentifierNode.bind(NodeCreators),
  createConditionNode: NodeCreators.createConditionNode.bind(NodeCreators),
  createUnaryOperationNode:
    NodeCreators.createUnaryOperationNode.bind(NodeCreators),
  createLogicalOperationNode:
    NodeCreators.createLogicalOperationNode.bind(NodeCreators),
  handleInParenthesis: NodeCreators.handleInParenthesis.bind(NodeCreators),
};
