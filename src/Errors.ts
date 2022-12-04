import type { FilterNode } from "./DataProcessing";
import type { PrintFilterTreeVisitor } from "./DataProcessing/Visitors";
import { Utilities } from "./Utilities";

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

  static throwIfNullOrUndefined(
    object: any,
    objectDescription: string = "object"
  ) {
    if (Utilities.isNullOrUndefined(object)) {
      throw new Error(
        String.join(
          objectDescription,
          String.Space,
          "cannot be null or undefined"
        )
      );
    }
  }

  static throwIfInvalid(
    isInvalid: (object: any) => boolean,
    object: any,
    objectDescription: string = "object"
  ) {
    if (isInvalid(object)) {
      throw new Error(
        String.join(objectDescription, String.Space, "is invalid")
      );
    }
  }

  static throwIfEmpty(string: string, stringDescription: string = "string") {
    if (Utilities.isEmptyString(string)) {
      throw new Error(
        String.join(stringDescription, String.Space, "cannot be empty")
      );
    }
  }

  static throwIfEmptyOrNullOrUndefined(
    string: string,
    stringDescription: string = "string"
  ) {
    this.throwIfNullOrUndefined(string, stringDescription);
    this.throwIfEmpty(string, stringDescription);
  }

  static throwIfEitherLeftHandSideOrRightHandSideInvalid(
    lhs: any,
    rhs: any,
    nodeType: string = "node",
    lhsDescription: string = "Left Hand Side",
    rhsDescription: string = "Right Hand Side"
  ) {
    Errors.throwIfNullOrUndefined(
      lhs,
      String.join(lhsDescription, " of ", nodeType)
    );
    Errors.throwIfNullOrUndefined(
      rhs,
      String.join(rhsDescription, " of ", nodeType)
    );
  }
}
