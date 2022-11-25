import * as parserGenerator from "peggy";
import { Utilities } from "../Utilities";
import {
  getInBuiltComparisonOperators,
  IComparisonOperator,
} from "./FilterComparisonOperators";
import { FilterNode, ParserOptions } from "./FilterNode";
import { IFilterNodeVisitor, PrintFilterTreeVisitor } from "./Visitors";

function noop() {}

export class ParserConfig {
  constructor(public supportedComparisonOperators?: IComparisonOperator[]) {
    this.supportedComparisonOperators ??= getInBuiltComparisonOperators();
  }
  public addOperator(operator: IComparisonOperator) {
    this.supportedComparisonOperators.push(operator);
  }
}

export interface IFilterQueryParser {
  parserConfig: ParserConfig;
  parse(filterQuery: string): FilterNode<any>;
  getFilterQuery(filterTree: FilterNode<any>): string;
  getGrammar(): string;
}

export default class FilterQueryParser implements IFilterQueryParser {
  private _parser: parserGenerator.Parser = undefined;
  private toQueryVisitor: IFilterNodeVisitor<string> =
    new PrintFilterTreeVisitor();
  constructor(public parserConfig: ParserConfig = undefined) {
    this.parserConfig ??= new ParserConfig();
  }
  parse(filterQuery: string): FilterNode<any> {
    if (Utilities.isNullOrUndefined(this._parser)) {
      const grammar = this.getGrammar();
      this._parser = parserGenerator.generate(grammar, {
        cache: true,
      });
    }
    return this._parser.parse(filterQuery, ParserOptions) as FilterNode<any>;
  }

  getFilterQuery(filterTree: FilterNode<any>): string {
    return this.toQueryVisitor.visit(filterTree);
  }

  getGrammar(): string {
    const operators = [
      ...(this.parserConfig?.supportedComparisonOperators ?? []),
    ].sort(
      (operator1, operator2) => operator1.precedence - operator2.precedence
    );

    const grammar = `
        {
            const {
                NullFilterNode,
                FloatLiteralNode,
                IntegerLiteralNode,
                BooleanLiteralNode,
                IdentifierNode,
                LogicalOperationNode,
                createLogicalOperationNode,
                createBoolNode,
                ConditionNode,
                createNumberNode,
                createIdentifierNode,
                StringLiteralNode,
                createStringNode,
                createConditionNode,
                createUnaryOperationNode,
                NotLogicalOperationNode,
                handleInParenthesis
            } = options;
        }
        start
            = logicalOr

        logicalOr
            = ${Utilities.modifyGrammarToRecognizeSpaces(
              'lhs:logicalAnd op:"||" rhs:logicalOr'
            )} { return createLogicalOperationNode(lhs, op, rhs);}
            / logicalAnd

        logicalAnd
            = ${Utilities.modifyGrammarToRecognizeSpaces(
              'lhs:condition op:"&&" rhs:logicalAnd'
            )} { return createLogicalOperationNode(lhs, op, rhs);}
            / condition



        condition   
            =${Utilities.modifyGrammarToRecognizeSpaces(
              "lhs:booleanTerm op:comparisonOp rhs:condition"
            )} {return createConditionNode(lhs, op, rhs)}
                / booleanTerm

        comparisonOp
            = ${operators
              .map((operator) => operator.operator.surroundWithQuotes())
              .join(
                String.Space + String.Punctuations.ForwardSlash + String.Space
              )}

        booleanTerm
            = terminal
            / op:"!" expr:logicalOr  {return createUnaryOperationNode(op, expr);}
            / "(" expr:logicalOr ")" {return handleInParenthesis(expr);}

        terminal "terminal"
            = boolean 
            / number
            / string
            / identifier

        boolean "boolean"
        = boolLiteral: ("true" / "false") {return createBoolNode(boolLiteral); }
        number "number"
        = float:(("-"[0-9]+ "." [0-9]*) / ([0-9]+ "." [0-9]*)) { return createNumberNode(float, true); }
        / integer:([0-9]+ / "-"[0-9]+) { return createNumberNode(integer, false); }
        string "string"
        = stringLiteral:('"' [^"]* '"') {return createStringNode(stringLiteral)}
        identifier "identifer"
        = identifier: ([^ 0-9->=()!<&|"][^ ->=!<()&|"]*) {return createIdentifierNode(identifier)}
        `;
    return grammar;
  }
}
