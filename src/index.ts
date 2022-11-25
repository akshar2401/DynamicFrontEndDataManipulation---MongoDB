import setUpStringType from "./String";
setUpStringType();
import FilterQueryParser from "./DataProcessing/Filter";
import { BaseComparisonOperator } from "./DataProcessing/FilterComparisonOperators";

const parser = new FilterQueryParser();
const output = parser.parse(
  '1 === 2 || !("Akshar" == name && !((true && (((false || "x" !== "y"))))) && (4.56 >= 45)) && true'
);
console.log(parser.getFilterQuery(output));
