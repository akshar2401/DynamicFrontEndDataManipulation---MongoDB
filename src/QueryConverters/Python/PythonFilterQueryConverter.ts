import { FilterNode } from "../../DataProcessing";
import { IFilterComparisonOperatorVisitor } from "../../DataProcessing/Filter/FilterComparisonOperators";
import { IFilterNodeVisitor } from "../../DataProcessing/Filter/Visitors";
import { IFilterQueryConverter } from "../FilterQueryConverter";
import {
  PythonFilterQueryConverterVisitor,
  PythonFilterQueryConverterVisitorOptions,
} from "./PythonFilterQueryConverterVisitor";

export interface IPythonFilterQueryConverter<AdditionalInfoType = any>
  extends IFilterQueryConverter<string, AdditionalInfoType> {}

export type PythonFilterQueryConverterOptions =
  PythonFilterQueryConverterVisitorOptions;

export class PythonFilterQueryConverter<AdditionalInfoType = any>
  implements IPythonFilterQueryConverter<AdditionalInfoType>
{
  private static defaultOptions: PythonFilterQueryConverterOptions = {
    preserveParenthesis: true,
    findBestPossibleMatchForNonPythonExistingComparisonOperators: true,
  };

  constructor(
    public readonly options: PythonFilterQueryConverterOptions = undefined,
    public readonly conversionVisitor: IFilterNodeVisitor<
      string,
      AdditionalInfoType
    > = undefined
  ) {
    this.options = Object.assign(
      {},
      PythonFilterQueryConverter.defaultOptions,
      options ?? {}
    );
    this.conversionVisitor ??= new PythonFilterQueryConverterVisitor(
      this.options
    );
  }
  convert(
    toBeConverted: FilterNode<any>,
    additionalInfo?: AdditionalInfoType
  ): string {
    return this.conversionVisitor.visit(toBeConverted, additionalInfo);
  }
}
