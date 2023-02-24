import { Utilities } from "../../Common";
import { FilterNode } from "./FilterNode";
import {
  ICanBeSplitComputationVisitor,
  IFilterSplitter,
} from "./FilterSplitter.types";
import { CanBeSplitComputationVisitor } from "./FilterSplitter";

export default class GeneralFilterSplitter implements IFilterSplitter {
  constructor(
    private canBeSplitComputationVisitor?: ICanBeSplitComputationVisitor
  ) {
    this.canBeSplitComputationVisitor ??= new CanBeSplitComputationVisitor();
  }
  split(node: FilterNode<any>): FilterNode<any>[] {
    const trees: FilterNode<any>[] = [];
    this.canBeSplitComputationVisitor.visit(node);
    this._splitInternal(node, trees);
    return trees;
  }

  private _splitInternal(node: FilterNode<any>, trees: FilterNode<any>[]) {
    if (Utilities.isNullOrUndefined(node)) {
      return;
    }
    if (this.canBeSplitComputationVisitor.canBeSplitTracker.canBeSplit(node)) {
      for (const child of node.children) {
        this._splitInternal(child, trees);
      }
    } else {
      trees.push(node);
    }
  }
}
