export type TokenType = string | (string | string[])[];

export type NodeCreatorAdditionalArguments = {
  span?: { source: any; start: number; end: number };
};
