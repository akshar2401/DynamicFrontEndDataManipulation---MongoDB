import * as parserGenerator from "peggy";
import { LabelsFinderVisitor } from "../Visitors";
export function getLabels(node: parserGenerator.ast.Node<any>) {
  const visitor = new LabelsFinderVisitor();
  visitor.visit(node);
  let nodes = visitor.matchedNodes as parserGenerator.ast.Labeled[];
  nodes = nodes.sort(
    (node1, node2) =>
      node1.labelLocation.start.offset - node2.labelLocation.start.offset
  );
  return nodes.map((node) => node.label);
}
