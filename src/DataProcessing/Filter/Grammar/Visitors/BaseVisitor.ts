import * as parserGenerator from "peggy";
import { Errors, Utilities } from "../../../../Common";
import { IGrammarTreeVisitor } from "./Visitor.types";

export abstract class BaseVisitor<
  ExtraArgumentsType extends Array<unknown> = any[],
  ReturnValueType = any
> implements IGrammarTreeVisitor
{
  abstract grammar(
    node: parserGenerator.ast.Grammar,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract top_level_initializer(
    node: parserGenerator.ast.TopLevelInitializer,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract initializer(
    node: parserGenerator.ast.Initializer,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract rule(
    node: parserGenerator.ast.Rule,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract named(
    node: parserGenerator.ast.Named,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract choice(
    node: parserGenerator.ast.Choice,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract action(
    node: parserGenerator.ast.Action,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract sequence(
    node: parserGenerator.ast.Sequence,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract labeled(
    node: parserGenerator.ast.Labeled,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract text(
    node: parserGenerator.ast.Prefixed,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract simple_and(
    node: parserGenerator.ast.Prefixed,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract simple_not(
    node: parserGenerator.ast.Prefixed,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract optional(
    node: parserGenerator.ast.Suffixed,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract zero_or_more(
    node: parserGenerator.ast.Suffixed,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract one_or_more(
    node: parserGenerator.ast.Suffixed,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract group(
    node: parserGenerator.ast.Group,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract semantic_and(
    node: parserGenerator.ast.SemanticPredicate,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract semantic_not(
    node: parserGenerator.ast.SemanticPredicate,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract rule_ref(
    node: parserGenerator.ast.RuleReference,
    ...args: ExtraArgumentsType
  ): ReturnValueType;
  abstract literal(
    node: parserGenerator.ast.Literal,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract class(
    node: parserGenerator.ast.CharacterClass,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  abstract any(
    node: parserGenerator.ast.Any,
    ...args: ExtraArgumentsType
  ): ReturnValueType;

  visit(
    node: parserGenerator.ast.Node<string>,
    ...args: ExtraArgumentsType
  ): ReturnValueType {
    if (Utilities.isNullOrUndefined(node)) {
      return;
    }
    Errors.throwIfNotFunction(
      this[node.type],
      "Visitor Action for " + node.type
    );
    return this[node.type](node, ...args);
  }
}
