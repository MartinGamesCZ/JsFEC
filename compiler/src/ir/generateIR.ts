import llvm from "llvm-ir";

export default function generateIR(ast: any) {
  const ir = llvm.create();

  const i32 = ir.i(32);
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

  console.log(ir.build());
}
