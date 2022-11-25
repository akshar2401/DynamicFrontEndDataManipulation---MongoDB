import { IPagination } from "../DataProcessing";
import { IQueryConverter } from "./QueryConverter";

export interface IPaginationQueryConverter<Query>
  extends IQueryConverter<IPagination, Query> {}
