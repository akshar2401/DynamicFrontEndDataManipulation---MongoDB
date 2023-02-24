import { Errors } from "../../Errors";
import { Utilities } from "../../Utilities";
import {
  FilterNode,
  NullFilterNode,
  FloatLiteralNode,
  IntegerLiteralNode,
  BooleanLiteralNode,
  StringLiteralNode,
  IdentifierNode,
  ConditionNode,
  symbolsToOperators,
  BinaryLogicalOperationNode,
  UnaryLogicalOperators,
  NotLogicalOperationNode,
  ListSeparatorNode,
  ListNode,
  FilterNodeType,
  KeyValuePairNode,
  ObjectSeparatorNode,
  ObjectNode,
} from "./FilterNode";
import { NodeCreatorAdditionalArguments, TokenType } from "./NodeCreator.types";

export class NodeCreators {
  static createNumberNode(
    tokens: TokenType,
    isFloat?: boolean,
    additionalArgs?: NodeCreatorAdditionalArguments
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

  static createBoolNode(
    token: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    return new BooleanLiteralNode(token);
  }

  static createStringNode(
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    if (Utilities.isNullOrUndefined(tokens)) {
      return new NullFilterNode();
    }

    return new StringLiteralNode(this.flattenAndJoinTokens(tokens));
  }

  static createIdentifierNode(
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
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
    rhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      lhs,
      rhs,
      "Condition Node"
    );
    return new ConditionNode(operator, lhs, rhs);
  }

  static createBinaryLogicalOperationNode(
    lhs: FilterNode<any>,
    operator: string,
    rhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    const binaryLogicalOperator = symbolsToOperators[operator];
    Errors.throwIfInvalid(
      Utilities.isNullOrUndefined,
      binaryLogicalOperator,
      String.join("Binary Logical Operator ", operator)
    );
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      lhs,
      rhs,
      "Binary Logical Operator Node"
    );

    return new BinaryLogicalOperationNode(
      binaryLogicalOperator,
      lhs,
      rhs,
      operator
    );
  }

  static createUnaryOperationNode(
    operator: string,
    lhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    const unaryOp: UnaryLogicalOperators = symbolsToOperators[operator];
    Errors.throwIfInvalid(
      Utilities.isNullOrUndefined,
      unaryOp,
      String.join("Unary Operator ", operator)
    );
    Errors.throwIfNullOrUndefined(
      lhs,
      String.join("Right Hand Side of ", operator)
    );
    switch (unaryOp) {
      case UnaryLogicalOperators.NOT:
        return new NotLogicalOperationNode(operator, lhs);
      default:
        return new NullFilterNode();
    }
  }

  static createListSeparatorNode(
    lhs: FilterNode<any>,
    sep: string,
    rhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      lhs,
      rhs,
      "List Separator Node"
    );
    return new ListSeparatorNode(sep, lhs, rhs);
  }

  static createListNode(
    startNode?: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    const listNode = new ListNode();
    if (Utilities.isNullOrUndefined(startNode)) {
      return listNode;
    }

    this.buildListNodeChildren(startNode, listNode);
    return listNode;
  }

  private static buildListNodeChildren(
    startNode: FilterNode<any>,
    listNode: ListNode
  ) {
    if (Utilities.oneOf(Utilities.isNullOrUndefined, startNode, listNode)) {
      return;
    }

    if (startNode.type !== FilterNodeType.ListSeparator) {
      listNode.add(startNode);
      return;
    }

    const listSeparatorNode = startNode.As<ListSeparatorNode>();
    listNode.addSeparator(listSeparatorNode);
    this.buildListNodeChildren(listSeparatorNode.left, listNode);
    this.buildListNodeChildren(listSeparatorNode.right, listNode);
  }

  static createKeyValuePairNode(
    keyNode: FilterNode<any>,
    separator: string,
    valueNode: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      keyNode,
      valueNode,
      "Key Value Pair Node",
      "Key Node",
      "Value Node"
    );

    return new KeyValuePairNode(separator, keyNode, valueNode);
  }

  static createObjectSeparatorNode(
    lhs: FilterNode<any>,
    separator: string,
    rhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      lhs,
      rhs,
      "Object Separator Node"
    );

    return new ObjectSeparatorNode(separator, lhs, rhs);
  }

  static createObjectNode(
    startNode?: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    const objectNode = new ObjectNode();
    if (Utilities.isNullOrUndefined(startNode)) {
      return objectNode;
    }

    this.buildObjectNodeChildren(startNode, objectNode);
    return objectNode;
  }

  private static buildObjectNodeChildren(
    startNode: FilterNode<any>,
    objectNode: ObjectNode
  ) {
    if (
      Utilities.oneOf(Utilities.isNullOrUndefined, startNode, objectNode) ||
      Utilities.notIn(
        startNode.type,
        FilterNodeType.KeyValuePair,
        FilterNodeType.ObjectSeparator
      )
    ) {
      return;
    }

    if (startNode.type === FilterNodeType.KeyValuePair) {
      objectNode.add(startNode);
      return;
    }

    const objectSeparatorNode = startNode as ObjectSeparatorNode;
    objectNode.addSeparator(objectSeparatorNode);
    this.buildObjectNodeChildren(objectSeparatorNode.left, objectNode);
    this.buildObjectNodeChildren(objectSeparatorNode.right, objectNode);
  }

  static handleInParenthesis(
    node: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
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
  BinaryLogicalOperationNode,
  NotLogicalOperationNode,
  ListSeparatorNode,
  ListNode,
  ObjectNode,
  ObjectSeparatorNode,
  KeyValuePairNode,
  createBoolNode: NodeCreators.createBoolNode.bind(NodeCreators),
  createStringNode: NodeCreators.createStringNode.bind(NodeCreators),
  createNumberNode: NodeCreators.createNumberNode.bind(NodeCreators),
  createIdentifierNode: NodeCreators.createIdentifierNode.bind(NodeCreators),
  createConditionNode: NodeCreators.createConditionNode.bind(NodeCreators),
  createUnaryOperationNode:
    NodeCreators.createUnaryOperationNode.bind(NodeCreators),
  createBinaryLogicalOperationNode:
    NodeCreators.createBinaryLogicalOperationNode.bind(NodeCreators),
  createListSeparatorNode: NodeCreators.createListSeparatorNode,
  createListNode: NodeCreators.createListNode.bind(NodeCreators),
  createKeyValuePairNode: NodeCreators.createKeyValuePairNode,
  createObjectSeparatorNode: NodeCreators.createObjectSeparatorNode,
  createObjectNode: NodeCreators.createObjectNode.bind(NodeCreators),
  handleInParenthesis: NodeCreators.handleInParenthesis.bind(NodeCreators),
};
