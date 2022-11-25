export class ErrorMessages {
  static cannotNotHaveChildrenErrorMessage(nodeName: string) {
    return `${nodeName} cannot have children nodes`;
  }

  static noMoreThanChildrenErrorMessage(
    nodeName: string,
    maxChildrenCount: number
  ) {
    return `${nodeName} cannot have more than ${maxChildrenCount} children nodes`;
  }
}
