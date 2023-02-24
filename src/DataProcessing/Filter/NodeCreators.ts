import { Errors, Utilities } from "../../Common";
import { IComparisonOperator } from "./FilterComparisonOperators";
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
    Errors.throwIfObjEmptyOrNullOrUndefined(tokens, "createNumberNode.tokens");
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
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfObjEmptyOrNullOrUndefined(tokens, "createBoolNode.tokens");
    return new BooleanLiteralNode(tokens);
  }

  static createStringNode(
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfObjEmptyOrNullOrUndefined(tokens, "createStringNode.tokens");
    return new StringLiteralNode(this.flattenAndJoinTokens(tokens));
  }

  static createIdentifierNode(
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    let token: string;
    Errors.throwIfObjEmptyOrNullOrUndefined(
      tokens,
      "createIdentifierNode.tokens"
    );
    Errors.throwIfObjEmptyOrNullOrUndefined(
      (token = this.flattenAndJoinTokens(tokens)),
      "createIdentifierNode.token"
    );

    return new IdentifierNode(token);
  }

  static createConditionNode(
    lhs: FilterNode<any>,
    operator: IComparisonOperator,
    rawOperatorToken: string,
    rhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      lhs,
      rhs,
      "Condition Node"
    );
    Errors.throwIfNullOrUndefined(operator, "createConditionNode.operator");
    Errors.throwIfEmptyOrNullOrUndefined(
      rawOperatorToken,
      "createConditionNode.rawOperatorToken"
    );
    return new ConditionNode(operator, rawOperatorToken, lhs, rhs);
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
    Errors.throwIfEmptyOrNullOrUndefined(sep, "createListSeparatorNode.sep");
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
    Errors.throwIfEmptyOrNullOrUndefined(
      separator,
      "createKeyValuePairNode.separator"
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
    Errors.throwIfEmptyOrNullOrUndefined(
      separator,
      "createObjectSeparatorNode.separator"
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
    Errors.throwIfNullOrUndefined(node, "handleInParenthesis.node");
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
