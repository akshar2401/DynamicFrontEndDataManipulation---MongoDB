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
  KeyValuePairNode,
  ObjectNode,
  ObjectSeparatorNode,
  ISeparatorNode,
  SeparatedChildrenNode,
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
  visitKeyValuePairNode(filterNode: KeyValuePairNode): ReturnType;
  visitObjectNode(filterNode: ObjectNode): ReturnType;
  visitObjectSeparatorNode(filterNode: ObjectSeparatorNode): ReturnType;
}

export interface IVisitorComptabileFilterNode<ReturnType> {
  accept(visitor: IFilterNodeVisitor<ReturnType>): ReturnType;
}

export type PrintFilterTreeVisitorOptions = {
  printOutput?: boolean;
  defaultListSeparator?: (node?: ListNode) => string;
  defaultObjectSeparator?: (node?: ObjectNode) => string;
  getSpacesAroundSeparator?(
    node?: SeparatedChildrenNode<any> | (FilterNode<any> & ISeparatorNode)
  ): {
    before: string;
    after: string;
  };
};
export class PrintFilterTreeVisitor implements IFilterNodeVisitor<string> {
  private static defaultOptions: PrintFilterTreeVisitorOptions = {
    printOutput: false,
    defaultListSeparator(node?) {
      return String.Punctuations.Comma;
    },
    defaultObjectSeparator(node?) {
      return String.Punctuations.Comma;
    },
    getSpacesAroundSeparator(node?) {
      return { before: String.Empty, after: String.Space };
    },
  };

  constructor(private options: PrintFilterTreeVisitorOptions = {}) {
    this.options = Object.assign(
      {},
      PrintFilterTreeVisitor.defaultOptions,
      options
    );
  }

  visit(filterNode: FilterNode<any>) {
    const output = filterNode.accept(this);
    if (this.options.printOutput) console.log(output);
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
    const listNodeStringRepresentation = [String.Brackets.Opening.Square];
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
            ? this.options.defaultListSeparator(filterNode)
            : filterNode.separatorAt(childIndex - 1)?.separator ??
              this.options.defaultListSeparator(filterNode);
        const spaces = this.options.getSpacesAroundSeparator(filterNode);
        listNodeStringRepresentation.push(spaces.before);
        listNodeStringRepresentation.push(separator);
        listNodeStringRepresentation.push(spaces.after);
      }

      listNodeStringRepresentation.push(childStringRepresentation);
    }
    listNodeStringRepresentation.push(String.Brackets.Closing.Square);

    return this.wrap(
      filterNode,
      listNodeStringRepresentation.join(String.Empty)
    );
  }

  private visitSeparatorNode(filterNode: ISeparatorNode & FilterNode<any>) {
    const childrenStringRepresentation: string[] = [];
    for (const child of filterNode.children) {
      const childStringRepresentation = child?.accept(this) ?? String.Empty;
      childrenStringRepresentation.push(childStringRepresentation);
    }

    const spaces = this.options.getSpacesAroundSeparator(filterNode);
    return this.wrap(
      filterNode,
      childrenStringRepresentation.join(
        String.join(spaces.before, filterNode.separator, spaces.after)
      )
    );
  }

  visitListSeparatorNode(filterNode: ListSeparatorNode): string {
    return this.visitSeparatorNode(filterNode);
  }

  visitKeyValuePairNode(filterNode: KeyValuePairNode) {
    return this.visitSeparatorNode(filterNode);
  }

  visitObjectNode(filterNode: ObjectNode) {
    const objectNodeStringRepresentation = [String.Brackets.Opening.Curly];
    for (
      let keyValueIndex = 0;
      keyValueIndex < filterNode.data;
      keyValueIndex++
    ) {
      const keyValueStringRepresentation =
        filterNode.childAt(keyValueIndex)?.accept(this) ?? String.Empty;
      if (keyValueIndex > 0) {
        const separator =
          keyValueIndex - 1 < 0
            ? this.options.defaultObjectSeparator(filterNode)
            : filterNode.separatorAt(keyValueIndex - 1).separator ??
              this.options.defaultObjectSeparator(filterNode);
        const spaces = this.options.getSpacesAroundSeparator(filterNode);
        objectNodeStringRepresentation.push(spaces.before);
        objectNodeStringRepresentation.push(separator);
        objectNodeStringRepresentation.push(spaces.after);
      }

      objectNodeStringRepresentation.push(keyValueStringRepresentation);
    }

    objectNodeStringRepresentation.push(String.Brackets.Closing.Curly);

    return this.wrap(
      filterNode,
      objectNodeStringRepresentation.join(String.Empty)
    );
  }
  visitObjectSeparatorNode(filterNode: ObjectSeparatorNode) {
    return this.visitSeparatorNode(filterNode);
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
