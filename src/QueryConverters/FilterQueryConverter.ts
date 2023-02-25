import type { FilterNode } from "../DataProcessing";
import { IQueryConverter } from "./QueryConverter";

export interface IFilterQueryConverter<Query, AdditionalInfoType = any>
  extends IQueryConverter<FilterNode<any>, Query, AdditionalInfoType> {}
