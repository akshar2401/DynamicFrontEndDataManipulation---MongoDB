import { FilterNodesVisitor } from "./FilterNodesVisitor";
import * as parserGenerator from "peggy";

export class LabelsFinderVisitor extends FilterNodesVisitor<parserGenerator.ast.Labeled> {
  constructor() {
    super((node) => {
      return node.type === "labeled";
    });
  }
}
