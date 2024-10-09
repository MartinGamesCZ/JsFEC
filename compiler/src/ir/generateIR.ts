import LLVM from "llvm-ir";
import { LLVMDeclarations } from "./declarations";

export default function generateIR(ast: any) {
  const ir = LLVM.create();

  const fn = ir.fn(ir.signature(ir.i(32), []), "main");

  for (const node of ast.body) {
    gir(node, ir, fn);
  }

  fn.body.terminate("ret", [ir.i(32), "0"]);

  return ir;

  /*const i32 = ir.i(32);
  const i8 = ir.i(8).ptr();

  const sig = ir.signature(i32, [i8]);
  const sig2 = ir.signature(i32, []);

  const str = ir.cstr("Hello, World!\n");

  const fn = ir.fn(sig2, "main");
  fn.body.push(
    ir._("getelementptr [15 x i8], [15 x i8]*", str, "i32 0", "i32 0")
  );
  fn.body.push(ir._("call i32 (i8*) @printf(i8* %i0)"));
  fn.body.terminate("ret", [i32, "0"]);

  ir.declare(sig, "printf");

  console.log(ir.build());*/
}

export function gir(node: any, llvm: any, fn: any, args?: any) {
  switch (node.type) {
    case "ExpressionStatement":
      return girExpressionStatement(node, llvm, fn);
    case "CallExpression":
      return girCallExpression(node, llvm, fn);
    case "Identifier":
      return girIdentifier(node, llvm, fn, args);
    case "Literal":
      return girLiteral(node, llvm, fn);
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

export function girExpressionStatement(node: any, llvm: any, fn: any) {
  const { expression } = node;

  gir(expression, llvm, fn);
}

export function girCallExpression(node: any, llvm: any, fn: any) {
  const { callee, arguments: args } = node;

  gir(callee, llvm, fn, args);
}

export function girIdentifier(node: any, llvm: any, fn: any, args: any[]) {
  const dec =
    LLVMDeclarations[node.name as keyof typeof LLVMDeclarations](llvm);

  const gir_args = [];

  if (args) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      gir_args.push(gir(arg, llvm, fn));
    }
  }

  const inst2 = llvm._("call", [
    dec.type,
    dec,
    "(" + gir_args.map((a: any) => a.asPtr()) + ")",
  ]);

  fn.body.push(inst2);

  //console.log(dec.type);
}

export function girLiteral(node: any, llvm: any, fn: any) {
  const { raw, value } = node;

  if (!raw.includes('"') && !raw.includes("'") && !raw.includes("`")) {
    throw new Error("Unsupported literal type");
  }

  const str = llvm.cstr(value);

  return {
    raw: str,
    asPtr: () => {
      const inst = llvm._("getelementptr", [
        str.type.to.type,
        ",",
        str.type,
        str,
        ", i32 0, i32 0",
      ]);

      fn.body.push(inst);

      return `i8* %i${fn.body.instructions.length - 1}`;
    },
  };
}
