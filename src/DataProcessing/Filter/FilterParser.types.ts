import { FilterNode } from "./FilterNode";

export interface IFilterQueryParserOptions {
  handleMatch(ruleId: string, ruleIndex: number, args: any[]): any;
}

export interface IFilterQueryParser {
  parse(
    filterQuery: string,
    regenerateParser?: boolean,
    options?: object
  ): FilterNode<any>;
}
