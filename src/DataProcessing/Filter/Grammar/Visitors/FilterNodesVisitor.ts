import * as parserGenerator from "peggy";
import { BaseVisitor } from "./BaseVisitor";

export class FilterNodesVisitor<
  FilteredNodesType extends parserGenerator.ast.Node<any> = parserGenerator.ast.Node<any>
> extends BaseVisitor<any[], void> {
  constructor(
    private readonly filterCallBack: (
      node: parserGenerator.ast.Node<string>
    ) => boolean,
    public readonly matchedNodes: FilteredNodesType[] = []
  ) {
    super();
  }

  grammar(node: parserGenerator.ast.Grammar, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.topLevelInitializer, ...args);
    this.visit(node.initializer, ...args);
    for (const rule of node.rules) {
      this.visit(rule, ...args);
    }
  }
  top_level_initializer(
    node: parserGenerator.ast.TopLevelInitializer,
    ...args: any[]
  ) {
    this.handleNode(node);
  }

  initializer(node: parserGenerator.ast.Initializer, ...args: any[]) {
    this.handleNode(node);
  }

  rule(node: parserGenerator.ast.Rule, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  named(node: parserGenerator.ast.Named, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  choice(node: parserGenerator.ast.Choice, ...args: any[]) {
    this.handleNode(node);
    for (const alternativeNode of node.alternatives) {
      this.visit(alternativeNode, ...args);
    }
  }
  action(node: parserGenerator.ast.Action, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  sequence(node: parserGenerator.ast.Sequence, ...args: any[]) {
    this.handleNode(node);
    for (const element of node.elements) {
      this.visit(element, ...args);
    }
  }
  labeled(node: parserGenerator.ast.Labeled, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  text(node: parserGenerator.ast.Prefixed, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  simple_and(node: parserGenerator.ast.Prefixed, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  simple_not(node: parserGenerator.ast.Prefixed, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  optional(node: parserGenerator.ast.Suffixed, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  zero_or_more(node: parserGenerator.ast.Suffixed, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  one_or_more(node: parserGenerator.ast.Suffixed, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  group(node: parserGenerator.ast.Group, ...args: any[]) {
    this.handleNode(node);
    this.visit(node.expression, ...args);
  }
  semantic_and(node: parserGenerator.ast.SemanticPredicate, ...args: any[]) {
    this.handleNode(node);
  }
  semantic_not(node: parserGenerator.ast.SemanticPredicate, ...args: any[]) {
    this.handleNode(node);
  }
  rule_ref(node: parserGenerator.ast.RuleReference, ...args: any[]) {
    this.handleNode(node);
  }
  literal(node: parserGenerator.ast.Literal, ...args: any[]) {
    this.handleNode(node);
  }
  class(node: parserGenerator.ast.CharacterClass, ...args: any[]) {
    this.handleNode(node);
  }
  any(node: parserGenerator.ast.Any, ...args: any[]) {
    this.handleNode(node);
  }

  private handleNode(node: parserGenerator.ast.Node<any>) {
    if (this.filterCallBack(node)) {
      this.matchedNodes.push(node as FilteredNodesType);
    }
  }
}
