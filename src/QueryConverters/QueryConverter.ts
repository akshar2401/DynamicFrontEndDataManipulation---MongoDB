export interface IQueryConverter<
  ToBeConvertedType,
  Query,
  AdditionalInfoType = any
> {
  convert(
    toBeConverted: ToBeConvertedType,
    additionalInfo?: AdditionalInfoType
  ): Query;
}
