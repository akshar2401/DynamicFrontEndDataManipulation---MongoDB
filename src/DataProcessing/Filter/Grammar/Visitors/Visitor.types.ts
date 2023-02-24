import * as parserGenerator from "peggy";

export interface IGrammarTreeVisitor
  extends Required<parserGenerator.compiler.visitor.NodeTypes> {
  visit(node: parserGenerator.ast.Node<string>, ...args: any[]): any;
}
