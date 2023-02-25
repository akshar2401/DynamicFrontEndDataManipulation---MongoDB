import { ISorting } from "../DataProcessing";
import { IQueryConverter } from "./QueryConverter";

export interface ISortingQueryConverter<
  FieldType,
  QueryType,
  AdditionalInfoType = any
> extends IQueryConverter<ISorting<FieldType>, QueryType, AdditionalInfoType> {}
