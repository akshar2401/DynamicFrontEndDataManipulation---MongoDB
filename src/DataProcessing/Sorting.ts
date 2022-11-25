export enum SortingDirection {
  Ascending,
  Descending,
}
export interface ISorting<FieldType> {
  field: FieldType;
  direction: SortingDirection | SortingDirection[];
}

export class SingleFieldSorting<T> implements ISorting<T> {
  constructor(
    public readonly field: T = undefined,
    public readonly direction = SortingDirection.Ascending
  ) {}
}

export class MultipleFieldSorting<T>
  implements ISorting<SingleFieldSorting<T>[]>
{
  constructor(public readonly field: SingleFieldSorting<T>[] = []) {}
  public get direction() {
    return this.field.map((sortingObject) => sortingObject.direction);
  }
}
