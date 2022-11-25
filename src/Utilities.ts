export class Utilities {
  static isNull(object: any) {
    return object === null;
  }

  static isUndefined(object: any) {
    return typeof object === "undefined";
  }

  static isNullOrUndefined(object: any) {
    return this.isNull(object) || this.isUndefined(object);
  }

  static isNotNullOrUndefined(object: any) {
    return !this.isNullOrUndefined(object);
  }

  static isEmptyString(s: string) {
    return typeof s === "string" && s.length === 0;
  }

  static isNotEmptyString(s: string) {
    return !this.isEmptyString(s);
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
