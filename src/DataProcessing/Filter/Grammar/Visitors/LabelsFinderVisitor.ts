import { FilterNodesVisitor } from "./FilterNodesVisitor";

export class LabelsFinderVisitor extends FilterNodesVisitor {
  constructor() {
    super((node) => {
      return node.type === "labeled";
    });
  }
}
