import type { FilterNode } from "./DataProcessing";
import type { PrintFilterTreeVisitor } from "./DataProcessing/Visitors";

export class Errors {
  static cannotNotHaveChildrenErrorMessage(nodeName: string) {
    return `${nodeName} cannot have children nodes`;
  }

  static noMoreThanChildrenErrorMessage(
    nodeName: string,
    maxChildrenCount: number
  ) {
    return `${nodeName} cannot have more than ${maxChildrenCount} children nodes`;
  }

  static throwCannotEvaluateExpressionError(
    filterNode: FilterNode<any>,
    visitor: PrintFilterTreeVisitor
  ) {
    throw new Error(
      String.join("Cannot evaluate expression ", filterNode.accept(visitor))
    );
  }

  static throwCannotGivenEvaluateExpressionError(expr: string) {
    throw new Error(String.join("Cannot evaluate expression ", expr));
  }

  static throwIfNotAtLeastSize(arr: any[], atleastSize: number) {
    if (arr.length < atleastSize)
      throw new Error(`Size must be atleast ${atleastSize}`);
  }
}
