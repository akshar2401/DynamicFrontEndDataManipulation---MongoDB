import * as parserGenerator from "peggy";
import { LabelsFinderVisitor } from "../Visitors";

function getLabels(node: parserGenerator.ast.Node<any>) {
  const visitor = new LabelsFinderVisitor();
  visitor.visit(node);
  let nodes = visitor.matchedNodes;
  nodes = nodes.sort(
    (node1, node2) =>
      node1.labelLocation.start.offset - node2.labelLocation.start.offset
  );
  return nodes.map((node) => node.label);
}

export function getLabelsFromRule(label: string, rule: string) {
  const correctedRule = label + " = " + rule;
  try {
    const ruleAst = parserGenerator.parser.parse(correctedRule);
    return getLabels(ruleAst);
  } catch {
    return [];
  }
}
