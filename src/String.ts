declare global {
  interface StringConstructor {
    Empty: string;
    Space: string;
    Brackets: {
      Opening: {
        Square: string;
        Round: string;
        Curly: string;
      };
      Closing: {
        Square: string;
        Round: string;
        Curly: string;
      };
    };
    Punctuations: {
      Star: string;
      DoubleQuote: string;
      ForwardSlash: string;
      Comma: string;
    };
    join(...strings: string[]): string;
    repeat(s: string, repeatCount: number): string;
  }
  interface String {
    /**
     * Removes leading and trailing instances of given pattern. Removes leading and trailing white spaces if given pattern is not provided
     * @param s Pattern to remove from both ends. Default is whitespace
     */
    trim(s: string): string;
    surroundWithQuotes(quotes?: string): string;
    surroundWith(left: string, right?: string): string;
  }
}

function setUpStringType() {
  String.Empty = "";
  String.Space = " ";
  String.Brackets = {
    Opening: {
      Square: "[",
      Round: "(",
      Curly: "{",
    },
    Closing: {
      Square: "]",
      Round: ")",
      Curly: "}",
    },
  };
  String.Punctuations = {
    Star: "*",
    DoubleQuote: '"',
    ForwardSlash: "/",
    Comma: ",",
  };
  String.join = function (...strings: string[]) {
    return String.Empty.concat(...strings);
  };
  String.repeat = function (s: string, repeatCount: number) {
    const repeats: string[] = [];
    for (let i = 0; i < repeatCount; i++) {
      repeats.push(s);
    }

    return String.join(...repeats);
  };
  const originalTrimImpl = String.prototype.trim;
  String.prototype.trim = function (this: string, s?: string) {
    if (!s) {
      return originalTrimImpl.call(this);
    }
    let result = this;
    while (result && result.startsWith(s)) {
      result = result.substring(s.length);
    }

    while (result && result.endsWith(s)) {
      result = result.substring(0, result.length - s.length);
    }

    return result;
  };
  String.prototype.surroundWithQuotes = function (
    this: string,
    quotes?: string
  ) {
    return this.surroundWith(quotes ?? String.Punctuations.DoubleQuote);
  };

  String.prototype.surroundWith = function (
    this: string,
    left: string,
    right?: string
  ) {
    return String.join(left, this, right ?? left);
  };
}

export default setUpStringType;
