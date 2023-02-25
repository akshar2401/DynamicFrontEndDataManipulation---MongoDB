import { Errors } from "../../Common";
import {
  FilterNode,
  IntegerLiteralNode,
  FloatLiteralNode,
  BinaryLogicalOperationNode,
  ConditionNode,
  StringLiteralNode,
  IdentifierNode,
  BooleanLiteralNode,
  NotLogicalOperationNode,
  ListNode,
  ListSeparatorNode,
  KeyValuePairNode,
  ObjectNode,
  ObjectSeparatorNode,
  BinaryLogicalOperators,
} from "./FilterNode";
import {
  ICanBeSplitComputationResult,
  ICanBeSplitComputationVisitor,
  ICanBeSplitTracker,
} from "./FilterSplitter.types";

export class DefaultCanBeSplitTracker implements ICanBeSplitTracker {
  private canBeSplitStorage = new Map<FilterNode<any>, boolean>();

  public recordIfNodeCanBeSplit(node: FilterNode<any>, canBeSplit: boolean) {
    this.canBeSplitStorage.set(node, canBeSplit);
  }

  public canBeSplit(node: FilterNode<any>) {
    return this.canBeSplitStorage.has(node)
      ? this.canBeSplitStorage.get(node)
      : false;
  }

  public get items() {
    return this._items();
  }

  public *_items() {
    for (const item of this.canBeSplitStorage.entries()) {
      yield item;
    }
  }
}

class CanBeSplitComputationResult implements ICanBeSplitComputationResult {
  canBeSplit: boolean;

  constructor(canBeSplit: boolean) {
    this.canBeSplit = canBeSplit;
  }
}

export class CanBeSplitComputationVisitor
  implements ICanBeSplitComputationVisitor
{
  constructor(
    public readonly canBeSplitTracker: ICanBeSplitTracker = undefined
  ) {
    this.canBeSplitTracker ??= new DefaultCanBeSplitTracker();
  }

  visit(filterNode: FilterNode<any>) {
    const result = filterNode.accept(this) as ICanBeSplitComputationResult;
    return result;
  }

  visitIntegerLiteralNode(filterNode: IntegerLiteralNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitFloatLiteralNode(filterNode: FloatLiteralNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }

  visitBinaryLogicalOperationNode(filterNode: BinaryLogicalOperationNode) {
    this.visitChildren(filterNode);
    const operator = filterNode.data.operator;
    if (operator === BinaryLogicalOperators.AND) {
      return this.getResultAndRecordIfNodeCanBeSplit(filterNode, true);
    }
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitConditionNode(filterNode: ConditionNode) {
    this.visitChildren(filterNode);
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitStringLiteralNode(filterNode: StringLiteralNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitIdentifierNode(filterNode: IdentifierNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitBooleanLiteralNode(filterNode: BooleanLiteralNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }

  visitNotOperationNode(filterNode: NotLogicalOperationNode) {
    this.visitChildren(filterNode);
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitListNode(filterNode: ListNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitListSeparatorNode(filterNode: ListSeparatorNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitKeyValuePairNode(filterNode: KeyValuePairNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitObjectNode(filterNode: ObjectNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }
  visitObjectSeparatorNode(filterNode: ObjectSeparatorNode) {
    return this.getResultAndRecordIfNodeCanBeSplit(filterNode);
  }

  protected recordIfNodeCanBeSplit(node: FilterNode<any>, canBeSplit = false) {
    this.canBeSplitTracker.recordIfNodeCanBeSplit(node, canBeSplit);
    return canBeSplit;
  }

  protected visitChildren(filterNode: FilterNode<any>) {
    for (const child of filterNode.children) {
      child.accept(this);
    }
  }

  private getResultAndRecordIfNodeCanBeSplit(
    filterNode: FilterNode<any>,
    canBeSplit = false
  ) {
    return new CanBeSplitComputationResult(
      this.recordIfNodeCanBeSplit(filterNode, canBeSplit)
    );
  }
}
