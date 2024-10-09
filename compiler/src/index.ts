import { $ } from "bun";
import convertToAST from "./ast/convertToAST";
import readCode from "./fs/readCode";
import writeStep, { Step } from "./fs/writeStep";
import generateIR from "./ir/generateIR";

const code = readCode("src/index.ts");
const ast = convertToAST(code);
writeStep(Step.AST, "index", ast);

const ir = generateIR(ast);
writeStep(Step.IR, "index", ir);

//await $`llc output/index.ir.ll -o output/index.ir.s`.text();
await $`clang -lc output/index.ir.ll -o output/index -fPIE -pie`.text();
