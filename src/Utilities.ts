export class Utilities {
  static isNull(object: any) {
    return object === null;
  }

  static isUndefined(object: any) {
    return typeof object === "undefined";
  }

  static isNullOrUndefined(object: any) {
    return Utilities.isNull(object) || Utilities.isUndefined(object);
  }

  static oneOf(func: (object: any) => boolean, ...objects: any[]) {
    return objects.some(func);
  }

  static isNotNullOrUndefined(object: any) {
    return !Utilities.isNullOrUndefined(object);
  }

  static isEmptyString(s: string) {
    return typeof s === "string" && s.length === 0;
  }

  static isNotEmptyString(s: string) {
    return !Utilities.isEmptyString(s);
  }

  static modifyGrammarToRecognizeSpaces(rule: string) {
    const tokens = rule.split(String.Space).filter((str) => !!str);
    return tokens.join(
      String.join(
        String.Space,
        String.join(
          String.Brackets.Opening.Square,
          String.Space,
          String.Brackets.Closing.Square,
          String.Punctuations.Star,
          String.Space
        ),
        String.Space
      )
    );
  }
}
