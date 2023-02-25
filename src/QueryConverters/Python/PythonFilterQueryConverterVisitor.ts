import { Errors, Utilities } from "../../Common";
import {
  FilterNode,
  IntegerLiteralNode,
  FloatLiteralNode,
  BinaryLogicalOperationNode,
  ConditionNode,
  StringLiteralNode,
  IdentifierNode,
  BooleanLiteralNode,
  NotLogicalOperationNode,
  ListNode,
  ListSeparatorNode,
  KeyValuePairNode,
  ObjectNode,
  ObjectSeparatorNode,
  BinaryLogicalOperators,
} from "../../DataProcessing";
import { IFilterComparisonOperatorVisitor } from "../../DataProcessing/Filter/FilterComparisonOperators";
import { IFilterNodeVisitor } from "../../DataProcessing/Filter/Visitors";
import {
  PythonFilterComparisonOperatorVisitor,
  PythonFilterComparisonOperatorVisitorOptions,
} from "./PythonFilterComparisonOperatorVisitor";

export type PythonFilterQueryConverterVisitorOptions = {
  preserveParenthesis?: boolean;
} & Partial<PythonFilterComparisonOperatorVisitorOptions>;

export class PythonFilterQueryConverterVisitor<AdditionalInfoType = any>
  implements IFilterNodeVisitor<string, AdditionalInfoType>
{
  private static defaultOptions: PythonFilterQueryConverterVisitorOptions = {
    preserveParenthesis: true,
    findBestPossibleMatchForNonPythonExistingComparisonOperators: true,
  };

  constructor(
    public readonly options: PythonFilterQueryConverterVisitorOptions = undefined,
    public readonly comparisonOperatorVisitor: IFilterComparisonOperatorVisitor<string> = undefined
  ) {
    this.options = Object.assign(
      {},
      PythonFilterQueryConverterVisitor.defaultOptions,
      options ?? {}
    );
    this.comparisonOperatorVisitor ??=
      new PythonFilterComparisonOperatorVisitor(this.options);
  }

  visit(filterNode: FilterNode<any>, additionalInfo?: any): string {
    this.throwIfNodeIsNullOrDefined(filterNode, FilterNode.name);
    const pythonFilterQuery: string =
      filterNode?.accept(this, additionalInfo) ?? String.Empty;
    return pythonFilterQuery;
  }
  visitIntegerLiteralNode(
    filterNode: IntegerLiteralNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, IntegerLiteralNode.name);
    return this.wrap(filterNode, filterNode.data.toString());
  }
  visitFloatLiteralNode(
    filterNode: FloatLiteralNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, FloatLiteralNode.name);
    return this.wrap(filterNode, filterNode.data.toString());
  }
  visitBinaryLogicalOperationNode(
    filterNode: BinaryLogicalOperationNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(
      filterNode,
      BinaryLogicalOperationNode.name
    );
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      filterNode?.left,
      filterNode?.right,
      filterNode.type
    );
    const leftCcnvertedQuery: string = filterNode.left.accept(
      this,
      additionalInfo
    );
    const rightConvertedQuery = filterNode.right.accept(this, additionalInfo);
    let pythonEquivalentOperator: string;
    switch (filterNode.data.operator) {
      case BinaryLogicalOperators.AND:
        pythonEquivalentOperator = "and";
      case BinaryLogicalOperators.OR:
        pythonEquivalentOperator = "or";
    }
    return this.wrap(
      filterNode,
      String.join(
        leftCcnvertedQuery,
        String.Space,
        pythonEquivalentOperator,
        String.Space,
        rightConvertedQuery
      )
    );
  }
  visitConditionNode(
    filterNode: ConditionNode<any>,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, ConditionNode.name);
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      filterNode?.left,
      filterNode?.right,
      filterNode.type
    );
    const leftConvertedQuery: string = filterNode.left.accept(
      this,
      additionalInfo
    );
    const rightConvertedQuery: string = filterNode.right.accept(
      this,
      additionalInfo
    );
    const pythonEquivalentOperator = this.comparisonOperatorVisitor.visit(
      filterNode.data.operator
    );

    return this.wrap(
      filterNode,
      String.join(
        leftConvertedQuery,
        String.Space,
        pythonEquivalentOperator,
        String.Space,
        rightConvertedQuery
      )
    );
  }
  visitStringLiteralNode(
    filterNode: StringLiteralNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, StringLiteralNode.name);
    return this.wrap(filterNode, filterNode.data.surroundWithQuotes());
  }
  visitIdentifierNode(
    filterNode: IdentifierNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, IdentifierNode.name);
    return this.wrap(filterNode, filterNode.data);
  }
  visitBooleanLiteralNode(
    filterNode: BooleanLiteralNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, BooleanLiteralNode.name);
    const pythonicBooleanLiteral = filterNode.data ? "True" : "False";
    return this.wrap(filterNode, pythonicBooleanLiteral);
  }
  visitNotOperationNode(
    filterNode: NotLogicalOperationNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, NotLogicalOperationNode.name);
    Errors.throwIfNullOrUndefined(
      filterNode.left,
      "Left child of" + filterNode.type + " node"
    );
    return this.wrap(
      filterNode,
      String.join(
        "not",
        String.Space,
        filterNode.left.accept(this, additionalInfo)
      )
    );
  }
  visitListNode(filterNode: ListNode, additionalInfo?: any): string {
    this.throwIfNodeIsNullOrDefined(filterNode, ListNode.name);
    const listPythonLiteral = [String.Brackets.Opening.Square];
    let isInitial = true;
    for (const childElement of filterNode.children) {
      if (Utilities.isNotNullOrUndefined(childElement)) {
        const childElementConvertedQuery: string = childElement.accept(
          this,
          additionalInfo
        );
        if (!isInitial) {
          listPythonLiteral.push(String.Punctuations.Comma + String.Space);
        }
        listPythonLiteral.push(childElementConvertedQuery);
        isInitial = false;
      }
    }
    listPythonLiteral.push(String.Brackets.Closing.Square);
    return this.wrap(filterNode, listPythonLiteral.join(String.Empty));
  }
  visitListSeparatorNode(
    filterNode: ListSeparatorNode,
    additionalInfo?: any
  ): string {
    const name = Utilities.isNotNullOrUndefined(filterNode)
      ? filterNode.type
      : ListSeparatorNode.name;
    Errors.throwNotSupportedError(name, " in python");
    return;
  }
  visitKeyValuePairNode(
    filterNode: KeyValuePairNode,
    additionalInfo?: any
  ): string {
    this.throwIfNodeIsNullOrDefined(filterNode, KeyValuePairNode.name);
    Errors.throwIfEitherLeftHandSideOrRightHandSideInvalid(
      filterNode?.keyNode,
      filterNode?.valueNode,
      filterNode.type,
      "Key Node",
      "Value Node"
    );
    const keyConvertedQuery: string = filterNode.keyNode.accept(
      this,
      additionalInfo
    );
    const valueConvertedQuery: string = filterNode.valueNode.accept(
      this,
      additionalInfo
    );

    return this.wrap(
      filterNode,
      String.join(
        keyConvertedQuery,
        filterNode.separator,
        String.Space,
        valueConvertedQuery
      )
    );
  }
  visitObjectNode(filterNode: ObjectNode, additionalInfo?: any): string {
    this.throwIfNodeIsNullOrDefined(filterNode, ObjectNode.name);
    const objectPythonLiteral = [String.Brackets.Opening.Curly];
    let isInitial = true;

    for (const keyValuePairChild of filterNode.children) {
      if (Utilities.isNotNullOrUndefined(keyValuePairChild)) {
        const keyValuePairChildConvertedQuery: string =
          keyValuePairChild.accept(this, additionalInfo);

        if (!isInitial) {
          objectPythonLiteral.push(String.Punctuations.Comma + String.Space);
        }
        objectPythonLiteral.push(keyValuePairChildConvertedQuery);
        isInitial = false;
      }
    }

    objectPythonLiteral.push(String.Brackets.Closing.Curly);
    return this.wrap(filterNode, objectPythonLiteral.join(String.Empty));
  }
  visitObjectSeparatorNode(
    filterNode: ObjectSeparatorNode,
    additionalInfo?: any
  ): string {
    const name = Utilities.isNotNullOrUndefined(filterNode)
      ? filterNode.type
      : ObjectSeparatorNode.name;
    Errors.throwNotSupportedError(name, " in python");
    return;
  }

  private wrap(node: FilterNode<any>, expr: string) {
    return this.options?.preserveParenthesis
      ? Utilities.wrap(node, expr)
      : expr;
  }

  private throwIfNodeIsNullOrDefined(
    node: FilterNode<any>,
    nodeDescription: string
  ) {
    Errors.throwIfNullOrUndefined(
      node,
      nodeDescription + " being converted to Python Query"
    );
  }
}
