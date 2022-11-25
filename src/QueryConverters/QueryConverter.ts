export interface IQueryConverter<ToBeConvertedType, Query> {
  convert(toBeConverted: ToBeConvertedType): Query;
}
