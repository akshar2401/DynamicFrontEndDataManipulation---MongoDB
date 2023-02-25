import { Errors, Utilities } from "../../Common";
import { IComparisonOperator } from "./FilterComparisonOperators";
import {
  FilterNode,
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
  UnaryOperationNode,
} from "./FilterNode";
import { NodeCreatorAdditionalArguments, TokenType } from "./NodeCreator.types";

export class NodeCreators {
  static createNumberNode(
    tokens: TokenType,
    isFloat?: boolean,
    additionalArgs?: NodeCreatorAdditionalArguments
  ): FilterNode<number> {
    Errors.throwIfObjEmptyOrNullOrUndefined(tokens, "createNumberNode.tokens");
    const token = this.flattenAndJoinTokens(tokens);
    if (Utilities.isNullOrUndefined(isFloat)) {
      isFloat = token.includes(".");
    }

    let numberNode: FilterNode<number>;
    if (isFloat) {
      numberNode = new FloatLiteralNode(token);
    } else {
      numberNode = new IntegerLiteralNode(token);
    }
    this.handleAdditionalArgs(numberNode, additionalArgs);
    return numberNode;
  }

  static createBooleanLiteralNode(
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfObjEmptyOrNullOrUndefined(tokens, "createBoolNode.tokens");
    const booleanLiteralNode = new BooleanLiteralNode(tokens);
    this.handleAdditionalArgs(booleanLiteralNode, additionalArgs);
    return booleanLiteralNode;
  }

  static createStringNode(
    tokens: TokenType,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfObjEmptyOrNullOrUndefined(tokens, "createStringNode.tokens");
    const stringNode = new StringLiteralNode(this.flattenAndJoinTokens(tokens));
    this.handleAdditionalArgs(stringNode, additionalArgs);
    return stringNode;
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

    const identNode = new IdentifierNode(token);
    this.handleAdditionalArgs(identNode, additionalArgs);
    return identNode;
  }

  static createConditionNode(
    lhs: FilterNode<any>,
    operator: IComparisonOperator,
    rhs: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      lhs,
      rhs,
      "Condition Node"
    );
    Errors.throwIfNullOrUndefined(operator, "createConditionNode.operator");
    const conditionNode = new ConditionNode(
      operator,
      operator.operator,
      lhs,
      rhs
    );
    this.handleAdditionalArgs(conditionNode, additionalArgs);
    return conditionNode;
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

    const binaryLogicalOperationNode = new BinaryLogicalOperationNode(
      binaryLogicalOperator,
      lhs,
      rhs,
      operator
    );
    this.handleAdditionalArgs(binaryLogicalOperationNode, additionalArgs);
    return binaryLogicalOperationNode;
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
    let unaryNode: UnaryOperationNode;
    switch (unaryOp) {
      case UnaryLogicalOperators.NOT:
        unaryNode = new NotLogicalOperationNode(operator, lhs);
        break;
    }
    this.handleAdditionalArgs(unaryNode, additionalArgs);
    return unaryNode;
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
    const listSeparatorNode = new ListSeparatorNode(sep, lhs, rhs);
    this.handleAdditionalArgs(listSeparatorNode, additionalArgs);
    return listSeparatorNode;
  }

  static createListNode(
    startNode?: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    const listNode = new ListNode();
    this.handleAdditionalArgs(listNode, additionalArgs);
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

    const keyValuePairNode = new KeyValuePairNode(
      separator,
      keyNode,
      valueNode
    );
    this.handleAdditionalArgs(keyValuePairNode, additionalArgs);
    return keyValuePairNode;
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

    const objectSeparatorNode = new ObjectSeparatorNode(separator, lhs, rhs);
    this.handleAdditionalArgs(objectSeparatorNode, additionalArgs);
    return objectSeparatorNode;
  }

  static createObjectNode(
    startNode?: FilterNode<any>,
    additionalArgs?: NodeCreatorAdditionalArguments
  ) {
    const objectNode = new ObjectNode();
    this.handleAdditionalArgs(objectNode, additionalArgs);
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
    this.handleAdditionalArgs(node, additionalArgs);
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

  private static handleAdditionalArgs(
    node: FilterNode<any>,
    additionalArgs: NodeCreatorAdditionalArguments
  ) {
    if (Utilities.isNotNullOrUndefined(additionalArgs?.span)) {
      node.span = {
        start: additionalArgs.span.start,
        end: additionalArgs.span.end,
      };
    }
  }
}

export const ParserOptions = {
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
  createBoolNode: NodeCreators.createBooleanLiteralNode.bind(NodeCreators),
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
