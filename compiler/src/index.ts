import convertToAST from "./ast/convertToAST";
import readCode from "./fs/readCode";
import writeStep, { Step } from "./fs/writeStep";
import generateIR from "./ir/generateIR";

const code = readCode("src/index.ts");
const ast = convertToAST(code);
writeStep(Step.AST, "index", ast);

generateIR(ast);
