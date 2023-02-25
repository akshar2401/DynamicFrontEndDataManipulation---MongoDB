import { Errors } from "../../Common";
import {
  EqualTo,
  GreaterThan,
  GreaterThanEqualTo,
  IComparisonOperator,
  IFilterComparisonOperatorVisitor,
  In,
  LessThan,
  LessThanEqualTo,
  NotEqualTo,
  StrictEqualTo,
  StrictNotEqualTo,
} from "../../DataProcessing/Filter/FilterComparisonOperators";

export type PythonFilterComparisonOperatorVisitorOptions = {
  findBestPossibleMatchForNonPythonExistingComparisonOperators?: boolean;
};

export class PythonFilterComparisonOperatorVisitor
  implements IFilterComparisonOperatorVisitor<string>
{
  private static defaultOptions: PythonFilterComparisonOperatorVisitorOptions =
    {
      findBestPossibleMatchForNonPythonExistingComparisonOperators: true,
    };

  constructor(
    public readonly options: PythonFilterComparisonOperatorVisitorOptions = undefined
  ) {
    this.options ??= Object.assign(
      {},
      PythonFilterComparisonOperatorVisitor.defaultOptions,
      options ?? {}
    );
  }

  visit(operator: IComparisonOperator): string {
    Errors.throwIfNullOrUndefined(
      operator,
      "Operator being converted to python operator"
    );
    const pythonOp: string = operator.accept(this);
    return pythonOp;
  }

  private validateAndReturnOperatorAsItIs(
    operator: IComparisonOperator,
    operatorName: string
  ) {
    Errors.throwIfNullOrUndefined(
      operator,
      operatorName + "Operator being converted to python operator"
    );
    return operator.operator;
  }
  visitGreaterThanEqualTo(operator: GreaterThanEqualTo): string {
    return this.validateAndReturnOperatorAsItIs(
      operator,
      GreaterThanEqualTo.name
    );
  }
  visitGreaterThan(operator: GreaterThan): string {
    return this.validateAndReturnOperatorAsItIs(operator, GreaterThan.name);
  }
  visitLessThan(operator: LessThan): string {
    return this.validateAndReturnOperatorAsItIs(operator, LessThan.name);
  }
  visitEqualTo(operator: EqualTo): string {
    return this.validateAndReturnOperatorAsItIs(operator, EqualTo.name);
  }
  visitStrictEqualTo(operator: StrictEqualTo): string {
    Errors.throwIfNullOrUndefined(
      operator,
      "StrictEqualTo Operator being converted to python operator"
    );
    this.raiseErrorIfFindBestPossibleForNonExistingPythonOpIsOff(operator);
    return new EqualTo().operator;
  }
  visitNotEqualTo(operator: NotEqualTo): string {
    return this.validateAndReturnOperatorAsItIs(operator, NotEqualTo.name);
  }
  visitStrictNotEqualTo(operator: StrictNotEqualTo): string {
    Errors.throwIfNullOrUndefined(
      operator,
      "StrictNotEqualTo Operator being converted to python operator"
    );
    this.raiseErrorIfFindBestPossibleForNonExistingPythonOpIsOff(operator);
    return new NotEqualTo().operator;
  }
  visitLessThanEqualTo(operator: LessThanEqualTo): string {
    return this.validateAndReturnOperatorAsItIs(operator, LessThanEqualTo.name);
  }
  visitIn(operator: In): string {
    return this.validateAndReturnOperatorAsItIs(operator, In.name);
  }

  private raiseErrorIfFindBestPossibleForNonExistingPythonOpIsOff(
    operator: IComparisonOperator
  ) {
    if (
      !this.options.findBestPossibleMatchForNonPythonExistingComparisonOperators
    ) {
      throw new Error(
        `Cannot find best match for ${operator.operator} even if it exists since findBestPossibleMatchForNonPythonExistingComparisonOperators is turned off. Please turn it on to find the best equivalent python comparison operator`
      );
    }
  }
}
