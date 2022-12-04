import type { FilterNode } from "../DataProcessing";
import { IQueryConverter } from "./QueryConverter";

export interface IFilterQueryConverter<Query>
  extends IQueryConverter<FilterNode<any>, Query> {}
