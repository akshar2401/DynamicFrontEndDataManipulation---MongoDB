import { Errors, Utilities } from "../../Common";
import { IComparisonOperator } from "./FilterComparisonOperators";
import type {
  IFilterNodeVisitor,
  IVisitorComptabileFilterNode,
} from "./Visitors";

export enum FilterNodeType {
  Integer = "integer",
  Float = "float",
  Boolean = "boolean",
  String = "string",
  Identifier = "identifier",
  Condition = "condition",
  BinaryLogicalOperation = "binary_logical_operation",
  NotLogicalOperation = "not",
  ListSeparator = "list_separator",
  List = "list",
  KeyValuePair = "key_value_pair",
  Object = "object",
  ObjectSeparator = "object_separator",
}

export enum BinaryLogicalOperators {
  AND = "and",
  OR = "or",
}

export enum UnaryLogicalOperators {
  NOT = "not",
}
export const symbolsToOperators = {
  "&&": BinaryLogicalOperators.AND,
  "||": BinaryLogicalOperators.OR,
  "!": UnaryLogicalOperators.NOT,
};

export abstract class FilterNode<TData>
  implements IVisitorComptabileFilterNode
{
  public abstract type: FilterNodeType;
  protected _children: FilterNode<any>[];
  public abstract data: TData;
  protected _span: { start: number; end: number };

  public parenthesisDepth = 0;

  constructor() {
    this._children = [];
  }

  public abstract accept(
    visitor: IFilterNodeVisitor<any, any>,
    additionalInfo?: any
  );

  public add(childNode: FilterNode<any>) {
    if (!childNode) {
      return;
    }
    this._children.push(childNode);
  }

  public get children() {
    return this.yieldChildren();
  }

  public childAt(index: number) {
    return Utilities.isValidIndex(index, this._children.length)
      ? this._children[index]
      : undefined;
  }

  public get childrenCount() {
    return this._children.length;
  }

  public get firstChild() {
    return this.childAt(0);
  }

  public get lastChild() {
    return this.childAt(this.childrenCount - 1);
  }

  private *yieldChildren() {
    for (const child of this._children) {
      yield child;
    }
  }

  public get span() {
    return this._span;
  }

  public set span(span: { start: number; end: number }) {
    Errors.throwIfNullOrUndefined(
      span?.start,
      "Start in Span of " + this.type + " node"
    );
    Errors.throwIfNullOrUndefined(
      span?.end,
      "End in Span of " + this.type + " node"
    );
    Errors.throwIfInvalid(
      (span: { start: number; end: number }) => span.start > span.end,
      span,
      `Span [${span.start}, ${span.end}] of ${this.type} node`
    );
    this._span = span;
  }

  public get spanWithoutAccountingParenthesis() {
    const span = this.span;
    return {
      start: span.start + this.parenthesisDepth,
      end: span.end - this.parenthesisDepth,
    };
  }

  public As<NodeType>(): NodeType {
    return this as unknown as NodeType;
  }
}

abstract class LeafFilterNode<TData> extends FilterNode<TData> {
  public override add() {
    throw Error(Errors.cannotNotHaveChildrenErrorMessage(this.type + " node"));
  }
}

export class IntegerLiteralNode extends LeafFilterNode<number> {
  public type = FilterNodeType.Integer;
  public data: number;
  constructor(data: string | number) {
    super();
    this.data = typeof data === "string" ? parseInt(data) : data;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitIntegerLiteralNode(this, additionalInfo);
  }
}

export class FloatLiteralNode extends LeafFilterNode<number> {
  public type = FilterNodeType.Float;
  public data: number;

  constructor(data: string | number) {
    super();
    this.data = typeof data === "string" ? parseFloat(data) : data;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitFloatLiteralNode(this, additionalInfo);
  }
}

export class StringLiteralNode extends LeafFilterNode<string> {
  public type = FilterNodeType.String;
  public data: string;

  constructor(data: string) {
    super();
    if (!data) {
      this.data = String.Empty;
    } else {
      this.data = data.trim('"');
    }
  }

  public accept(visitor: IFilterNodeVisitor<any, any>, additionalInfo?: any) {
    return visitor.visitStringLiteralNode(this, additionalInfo);
  }
}

export class IdentifierNode extends StringLiteralNode {
  public override type = FilterNodeType.Identifier;

  constructor(data: string) {
    super(data);
  }
  public override accept(
    visitor: IFilterNodeVisitor<any>,
    additionalInfo?: any
  ) {
    return visitor.visitIdentifierNode(this, additionalInfo);
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

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitBooleanLiteralNode(this, additionalInfo);
  }
}

export type BinaryOperatorNodeData<TData = any, operator = string> = {
  operator: operator;
  rawOperatorToken: string;
  data?: TData;
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
        Errors.noMoreThanChildrenErrorMessage(this.type + " node", 2)
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

export abstract class BinaryOperatorNode<
  TData = any,
  operator = string
> extends BinaryFilterNode<BinaryOperatorNodeData<TData, operator>> {
  public override data: BinaryOperatorNodeData<TData, operator>;
  constructor(
    operator: operator,
    rawOperatorToken?: string,
    data?: TData,
    lhs?: FilterNode<any>,
    rhs?: FilterNode<any>
  ) {
    super(lhs, rhs);
    rawOperatorToken ??= "";
    this.data = {
      operator,
      rawOperatorToken,
      data,
    };
  }
}

export class ConditionNode<TData = any> extends BinaryOperatorNode<
  TData,
  IComparisonOperator
> {
  public override type = FilterNodeType.Condition;

  constructor(
    operator: IComparisonOperator,
    rawOperatorToken: string,
    lhs: FilterNode<any>,
    rhs: FilterNode<any>,
    data?: TData
  ) {
    super(operator, rawOperatorToken, data, lhs, rhs);
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitConditionNode(this, additionalInfo);
  }
}

export class BinaryLogicalOperationNode extends BinaryOperatorNode<any> {
  public override type = FilterNodeType.BinaryLogicalOperation;

  constructor(
    operator: BinaryLogicalOperators,
    lhs: FilterNode<any>,
    rhs: FilterNode<any>,
    rawOperatorToken?: string
  ) {
    super(operator, rawOperatorToken, undefined, lhs, rhs);
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitBinaryLogicalOperationNode(this, additionalInfo);
  }
}

export interface ISeparatorNode {
  get separator(): string;
}

export class ListSeparatorNode
  extends BinaryFilterNode<string>
  implements ISeparatorNode
{
  public override type = FilterNodeType.ListSeparator;
  public data: string;
  constructor(sep: string, lhs: FilterNode<any>, rhs: FilterNode<any>) {
    super(lhs, rhs);
    this.data = sep;
  }

  public get separator() {
    return this.data;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitListSeparatorNode(this, additionalInfo);
  }
}

export abstract class SeparatedChildrenNode<TData> extends FilterNode<TData> {
  protected separators: ISeparatorNode[] = [];

  public addSeparator(node: ISeparatorNode) {
    this.separators.push(node);
  }

  public separatorAt(index: number) {
    return Utilities.isValidIndex(index, this.separators.length)
      ? this.separators[index]
      : undefined;
  }
}

export class ListNode extends SeparatedChildrenNode<number> {
  public type = FilterNodeType.List;
  /**
   * Returns the length of the array
   */
  public get data() {
    return this._children.length;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitListNode(this, additionalInfo);
  }
}

export class KeyValuePairNode
  extends BinaryFilterNode<string>
  implements ISeparatorNode
{
  public override type = FilterNodeType.KeyValuePair;
  public data: string;
  constructor(
    keyValueSeparator: string,
    keyNode: FilterNode<any>,
    valueNode: FilterNode<any>
  ) {
    super(keyNode, valueNode);
    this.data = keyValueSeparator;
  }

  public get separator(): string {
    return this.data;
  }

  public get keyNode() {
    return this.left;
  }

  public get valueNode() {
    return this.right;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitKeyValuePairNode(this, additionalInfo);
  }
}

export class ObjectSeparatorNode
  extends BinaryFilterNode<string>
  implements ISeparatorNode
{
  public override type = FilterNodeType.ObjectSeparator;
  public data: string;

  constructor(separator: string, lhs: FilterNode<any>, rhs: FilterNode<any>) {
    super(lhs, rhs);
    this.data = separator;
  }

  public get separator() {
    return this.data;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitObjectSeparatorNode(this, additionalInfo);
  }
}

export class ObjectNode extends SeparatedChildrenNode<number> {
  public type = FilterNodeType.Object;
  /**
   * Length of the object literal aka the number of key value pairs in it
   */
  public get data() {
    return this._children.length;
  }

  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitObjectNode(this, additionalInfo);
  }
}

export abstract class UnaryOperationNode extends BinaryOperatorNode<any> {
  public add(childNode: FilterNode<any>): void {
    if (this._children.length === 1) {
      throw new Error(
        Errors.noMoreThanChildrenErrorMessage(this.type + " node", 1)
      );
    }

    super.add(childNode);
  }

  constructor(
    operator: UnaryLogicalOperators,
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
    super(UnaryLogicalOperators.NOT, rawOperatorToken, lhs);
  }
  public accept(visitor: IFilterNodeVisitor<any>, additionalInfo?: any) {
    return visitor.visitNotOperationNode(this, additionalInfo);
  }
}
