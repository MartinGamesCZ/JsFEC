import LLVM from "llvm-ir";

export const LLVMDeclarations = {
  log: (llvm: any) => {
    const i32 = llvm.i(32);
    const i8_ptr = llvm.i(8).ptr();

    const sig = llvm.signature(i32, [i8_ptr]);

    const dec = llvm.declare(sig, "printf");

    return dec;
  },
};
