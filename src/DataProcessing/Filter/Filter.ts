import * as parserGenerator from "peggy";
import { Utilities } from "../../Common";
import {
  getInBuiltComparisonOperators,
  IComparisonOperator,
} from "./FilterComparisonOperators";
import { FilterNode } from "./FilterNode";
import { ParserOptions } from "./NodeCreators";
import { IFilterNodeVisitor, PrintFilterTreeVisitor } from "./Visitors";

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
  parse(filterQuery: string, options?: object): FilterNode<any>;
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
  parse(filterQuery: string, options = {}): FilterNode<any> {
    if (Utilities.isNullOrUndefined(this._parser)) {
      const grammar = this.getGrammar();
      console.log(
        (
          parserGenerator.parser.parse(
            'logicalOr =lhs:logicalAnd op:"||" rhs:logicalOr'
          ).rules[0].expression as any
        ).elements
      );
      this._parser = parserGenerator.generate(grammar, {
        cache: true,
        plugins: [],
      });
    }
    let parserOptions = Object.assign(
      {
        getComparisonOperator: (op: string) => {
          const operatorObj = (
            this.parserConfig.supportedComparisonOperators || []
          ).find((operator) => operator.operator === op);
          return operatorObj;
        },
      },
      options,
      ParserOptions
    );
    return this._parser.parse(filterQuery, parserOptions) as FilterNode<any>;
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
            Object.getOwnPropertyNames(options).forEach(name => {
              this[name] = options[name];
            })
            
            const {
                createBinaryLogicalOperationNode,
                createBoolNode,
                createNumberNode,
                createIdentifierNode,
                createStringNode,
                createConditionNode,
                createUnaryOperationNode,
                createListSeparatorNode,
                createListNode,
                createObjectNode,
                createKeyValuePairNode,
                createObjectSeparatorNode,
                handleInParenthesis
            } = options;
        }
        start
            = logicalOr

        logicalOr
            = ${Utilities.modifyGrammarToRecognizeSpaces(
              'lhs:logicalAnd op:"||" rhs:logicalOr'
            )} { return createBinaryLogicalOperationNode(lhs, op, rhs);}
            / logicalAnd

        logicalAnd
            = ${Utilities.modifyGrammarToRecognizeSpaces(
              'lhs:condition op:"&&" rhs:logicalAnd'
            )} { return createBinaryLogicalOperationNode(lhs, op, rhs, range(), this);}
            / condition



        condition   
            =${Utilities.modifyGrammarToRecognizeSpaces(
              "lhs:booleanTerm op:comparisonOp rhs:condition"
            )} {return createConditionNode(lhs,options.getComparisonOperator(op), op, rhs)}
                / booleanTerm

        comparisonOp
            = ${operators
              .map((operator) => operator.operator.surroundWithQuotes())
              .join(
                String.Space + String.Punctuations.ForwardSlash + String.Space
              )}

        booleanTerm
            = terminal
            / op:"!" expr:booleanTerm  {return createUnaryOperationNode(op, expr);}
            / "(" expr:logicalOr ")" {return handleInParenthesis(expr);}


        terminal "terminal"
            = boolean 
            / number
            / string
            / identifier
            / terminalListLiteral
            / terminalObjectLiteral
        terminalObjectLiteral "terminalObjectLiteral"
           = ${Utilities.modifyGrammarToRecognizeSpaces(
             '"{" "}"'
           )} {return createObjectNode(); }
           / ${Utilities.modifyGrammarToRecognizeSpaces(
             '"{" object:terminalObject "}"'
           )} {return createObjectNode(object);}
        terminalObject "terminalObject"
            = ${Utilities.modifyGrammarToRecognizeSpaces(
              'lhs:terimalObjectKeyValuePair sep:"," rhs:terminalObject'
            )} {return createObjectSeparatorNode(lhs, sep, rhs)}
            / terimalObjectKeyValuePair

        terimalObjectKeyValuePair "terimalObjectKeyValuePair"
          = ${Utilities.modifyGrammarToRecognizeSpaces(
            'key:(identifier/string/number) sep:":" value:terminal'
          )} {return createKeyValuePairNode(key, sep, value); }

        terminalListLiteral "terminalListLiteral"
          = ${Utilities.modifyGrammarToRecognizeSpaces(
            '"[" "]"'
          )} {return createListNode()}
          / ${Utilities.modifyGrammarToRecognizeSpaces(
            '"[" list:terminalList "]"'
          )}  {return createListNode(list) }
        terminalList "terminalList"
          = ${Utilities.modifyGrammarToRecognizeSpaces(
            'lhs:terminal sep:"," rhs:terminalList'
          )} { return createListSeparatorNode(lhs, sep, rhs)}
           / terminal

        boolean "boolean"
        = boolLiteral: ("true" / "false") {return createBoolNode(boolLiteral); }
        number "number"
        = float:(("-"[0-9]+ "." [0-9]*) / ([0-9]+ "." [0-9]*)) { return createNumberNode(float, true); }
        / integer:([0-9]+ / "-"[0-9]+) { return createNumberNode(integer, false); }
        string "string"
        = stringLiteral:('"' [^"]* '"') {return createStringNode(stringLiteral)}
        identifier "identifer"
        = identifier:([^ 0-9->=(){}!<&|:,"\\[\\]] ([^->=!<()&|:{},"\\]\\[ ]*)) {return createIdentifierNode(identifier)}
        `;
    return grammar;
  }
}
