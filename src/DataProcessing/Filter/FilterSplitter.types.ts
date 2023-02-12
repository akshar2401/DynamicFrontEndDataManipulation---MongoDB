import { FilterNode } from "./FilterNode";
import { IFilterNodeVisitor } from "./Visitors";

export interface ICanBeSplitTracker {
  recordIfNodeCanBeSplit(node: FilterNode<any>, canBeSplit: boolean): void;
  canBeSplit(node: FilterNode<any>): boolean;
  items: Generator<[FilterNode<any>, boolean], void, unknown>;
}

export interface ICanBeSplitComputationResult {
  canBeSplit: boolean;
}

export interface ICanBeSplitComputationVisitor
  extends IFilterNodeVisitor<ICanBeSplitComputationResult> {
  canBeSplitTracker: ICanBeSplitTracker;
}

export interface IFilterSplitter {
  split(node: FilterNode<any>): FilterNode<any>[];
}
