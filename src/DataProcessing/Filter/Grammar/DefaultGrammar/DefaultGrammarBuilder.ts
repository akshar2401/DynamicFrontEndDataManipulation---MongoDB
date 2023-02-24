import { BaseGrammarBuilder } from "../Builders";
import { BooleanGrammarRule } from "./BooleanGrammarRule";
import { BooleanTermGrammarRule } from "./BooleanTermGrammarRule";
import { DefaultComparisonOperatorGrammarRule } from "./ComparisonOperatorGrammarRule";
import { ConditionGrammarRule } from "./ConditionGrammarRule";
import { IdentifierGrammarRule } from "./IdentifierGrammarRule";
import { LogicalAndGrammarRule } from "./LogicalAndGrammarRule";
import { LogicalOrGrammarRule } from "./LogicalOrGrammarRule";
import { NumberGrammarRule } from "./NumberGrammarRule";
import { StartGrammarRule } from "./StartGrammarRule";
import { StringGrammarRule } from "./StringGrammarRule";
import { TerminalGrammarRule } from "./TerminalGrammarRule";
import { TerminalObjectKeyValuePairGrammarRule } from "./TerminalKeyValuePairGrammarRule";
import { TerminalListGrammarRule } from "./TerminalListGrammarRule";
import { TerminalListLiteralGrammarRule } from "./TerminalListLiteralGrammarRule";
import { TerminalObjectGrammarRule } from "./TerminalObjectGrammarRule";
import { TerminalObjectLiteralGrammarRule } from "./TerminalObjectLiteralGrammarRule";

export class DefaultGrammarBuilder extends BaseGrammarBuilder {
  constructor() {
    super();
    super.addRules(
      new StartGrammarRule(),
      new LogicalOrGrammarRule(),
      new LogicalAndGrammarRule(),
      new ConditionGrammarRule(),
      new DefaultComparisonOperatorGrammarRule(),
      new BooleanTermGrammarRule(),
      new TerminalGrammarRule(),
      new TerminalObjectLiteralGrammarRule(),
      new TerminalObjectGrammarRule(),
      new TerminalObjectKeyValuePairGrammarRule(),
      new TerminalListLiteralGrammarRule(),
      new TerminalListGrammarRule(),
      new BooleanGrammarRule(),
      new NumberGrammarRule(),
      new StringGrammarRule(),
      new IdentifierGrammarRule()
    );
  }
}
