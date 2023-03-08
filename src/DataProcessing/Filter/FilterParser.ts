import { FilterNode } from "./FilterNode";
import {
  IFilterQueryParser,
  IFilterQueryParserOptions,
} from "./FilterParser.types";
import { DefaultGrammarBuilder, IGrammarBuilder } from "./Grammar";
import * as parserGenerator from "peggy";
import { Utilities } from "../../Common";
import { BaseFilterQueryParserOptions } from "./FilterQueryParserOptions";

export class BaseFilterQueryParser implements IFilterQueryParser {
  private _parser: parserGenerator.Parser;
  constructor(public readonly grammarBuilder?: IGrammarBuilder) {
    this.grammarBuilder ??= new DefaultGrammarBuilder();
  }

  parse(
    filterQuery: string,
    options?: IFilterQueryParserOptions
  ): FilterNode<any> {
    if (Utilities.isNullOrUndefined(this._parser)) {
      const grammar = this.grammarBuilder.emitGrammar();
      this._parser = parserGenerator.generate(grammar, {
        cache: true,
        allowedStartRules: Array.from(this.grammarBuilder.startGrammarRules),
      });
    }

    const parserOutput: FilterNode<any> = this._parser.parse(
      filterQuery,
      options || new BaseFilterQueryParserOptions(this.grammarBuilder)
    );
    return parserOutput;
  }
}
