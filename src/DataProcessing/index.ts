import { IPagination } from "./Pagination";
import { ISorting } from "./Sorting";

export * from "./Pagination";
export * from "./Sorting";
export * from "./Filter";
export * from "./FilterNode";

export class DataProcessingModel<SortingFieldType> {
  constructor(
    public readonly sorting: ISorting<SortingFieldType>,
    public readonly pagination: IPagination
  ) {}

  toString() {
    return JSON.stringify(this, null, 4);
  }
}
