import { IPagination } from "../DataProcessing";
import { IQueryConverter } from "./QueryConverter";

export interface IPaginationQueryConverter<Query, AdditionalInfoType = any>
  extends IQueryConverter<IPagination, Query, AdditionalInfoType> {}
