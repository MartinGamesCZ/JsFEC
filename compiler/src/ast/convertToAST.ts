import * as acorn from "acorn";

export default function convertToAST(code: string) {
  const ast = acorn.parse(code, {
    ecmaVersion: 2020,
    sourceType: "module",
  });

  return ast;
}
