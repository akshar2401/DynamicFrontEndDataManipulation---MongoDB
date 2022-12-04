import {
  BinaryOperatorNode,
  BooleanLiteralNode,
  ConditionNode,
  FilterNode,
  FloatLiteralNode,
  IdentifierNode,
  IntegerLiteralNode,
  ListNode,
  ListSeparatorNode,
  BinaryLogicalOperationNode,
  NotLogicalOperationNode,
  NullFilterNode,
  StringLiteralNode,
  UnaryOperationNode,
} from "./FilterNode";

export interface IFilterNodeVisitor<ReturnType> {
  visit(filterNode: FilterNode<any>): ReturnType;
  visitIntegerLiteralNode(filterNode: IntegerLiteralNode): ReturnType;
  visitFloatLiteralNode(filterNode: FloatLiteralNode): ReturnType;
  visitBinaryLogicalOperationNode(
    filterNode: BinaryLogicalOperationNode
  ): ReturnType;
  visitConditionNode(filterNode: ConditionNode): ReturnType;
  visitStringLiteralNode(filterNode: StringLiteralNode): ReturnType;
  visitIdentifierNode(filterNode: IdentifierNode): ReturnType;
  visitBooleanLiteralNode(filterNode: BooleanLiteralNode): ReturnType;
  visitNullLiteralNode(filterNode: NullFilterNode): ReturnType;
  visitNotOperationNode(filterNode: NotLogicalOperationNode): ReturnType;
  visitListNode(filterNode: ListNode): ReturnType;
  visitListSeparatorNode(filterNode: ListSeparatorNode): ReturnType;
}

export interface IVisitorComptabileFilterNode<ReturnType> {
  accept(visitor: IFilterNodeVisitor<ReturnType>): ReturnType;
}

export class PrintFilterTreeVisitor implements IFilterNodeVisitor<string> {
  constructor(
    private printOutput = false,
    private defaultListSeparator = String.Punctuations.Comma
  ) {}

  visit(filterNode: FilterNode<any>) {
    const output = filterNode.accept(this);
    if (this.printOutput) console.log(output);
    return output;
  }

  visitIntegerLiteralNode(filterNode: IntegerLiteralNode) {
    return this.wrap(filterNode, filterNode.data.toString());
  }

  visitFloatLiteralNode(filterNode: FloatLiteralNode) {
    return this.wrap(filterNode, filterNode.data.toString());
  }

  visitBinaryLogicalOperationNode(
    filterNode: BinaryLogicalOperationNode
  ): string {
    return this.visitBinaryOperatorNode(filterNode);
  }
  visitConditionNode(filterNode: ConditionNode): string {
    return this.visitBinaryOperatorNode(filterNode);
  }
  private visitBinaryOperatorNode(filterNode: BinaryOperatorNode<any>): string {
    const lhs = filterNode.left?.accept(this) ?? String.Empty;
    const rhs = filterNode.right?.accept(this) ?? String.Empty;
    return this.wrap(
      filterNode,
      String.join(
        lhs,
        String.Space,
        filterNode.data.rawOperatorToken,
        String.Space,
        rhs
      )
    );
  }

  visitStringLiteralNode(filterNode: StringLiteralNode): string {
    return this.wrap(filterNode, filterNode.data.surroundWithQuotes());
  }
  visitIdentifierNode(filterNode: IdentifierNode): string {
    return this.wrap(filterNode, filterNode.data);
  }
  visitBooleanLiteralNode(filterNode: BooleanLiteralNode): string {
    return this.wrap(filterNode, filterNode.data.toString());
  }
  visitNullLiteralNode(filterNode: NullFilterNode): string {
    return this.wrap(filterNode, String.Empty);
  }
  visitNotOperationNode(filterNode: NotLogicalOperationNode): string {
    return this.visitUnaryOperatorNode(filterNode);
  }

  private visitUnaryOperatorNode(filterNode: UnaryOperationNode) {
    const lhs = filterNode.child?.accept(this) ?? String.Empty;
    return this.wrap(
      filterNode,
      String.join(filterNode.data.rawOperatorToken, lhs)
    );
  }

  visitListNode(filterNode: ListNode): string {
    let listNodeStringRepresentation = [String.Brackets.Opening.Square];
    for (
      let childIndex = 0;
      childIndex < filterNode.childrenCount;
      childIndex++
    ) {
      const childStringRepresentation =
        filterNode.childAt(childIndex)?.accept(this) ?? String.Empty;
      if (childIndex > 0) {
        const separator =
          childIndex - 1 < 0
            ? this.defaultListSeparator
            : filterNode.listSeparatorNodeAt(childIndex - 1)?.data ??
              this.defaultListSeparator;
        listNodeStringRepresentation.push(separator);
      }

      listNodeStringRepresentation.push(childStringRepresentation);
    }
    listNodeStringRepresentation.push(String.Brackets.Closing.Square);

    return this.wrap(
      filterNode,
      listNodeStringRepresentation.join(String.Empty)
    );
  }

  visitListSeparatorNode(filterNode: ListSeparatorNode): string {
    const lhs = filterNode.left?.accept(this) ?? String.Empty;
    const rhs = filterNode.right?.accept(this) ?? String.Empty;
    return this.wrap(
      filterNode,
      String.join(lhs, String.Space, filterNode.data, String.Space, rhs)
    );
  }

  private wrap(filterNode: FilterNode<any>, expr: string) {
    return filterNode.parenthesisDepth > 0
      ? expr.surroundWith(
          String.repeat(
            String.Brackets.Opening.Round,
            filterNode.parenthesisDepth
          ),
          String.repeat(
            String.Brackets.Closing.Round,
            filterNode.parenthesisDepth
          )
        )
      : expr;
  }
}
