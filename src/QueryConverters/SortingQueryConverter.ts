import { ISorting } from "../DataProcessing";
import { IQueryConverter } from "./QueryConverter";

export interface ISortingQueryConverter<FieldType, QueryType>
  extends IQueryConverter<ISorting<FieldType>, QueryType> {}
