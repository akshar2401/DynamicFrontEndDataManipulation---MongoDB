import { FilterNodesVisitor } from "./FilterNodesVisitor";
import * as parserGenerator from "peggy";

export class RuleRefNodesFinderVisitor extends FilterNodesVisitor<parserGenerator.ast.RuleReference> {
  constructor() {
    super((node) => {
      return node.type === "rule_ref";
    });
  }
}
