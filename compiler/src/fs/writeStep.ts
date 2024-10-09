import { writeFileSync } from "fs";
import { getCwd } from "./util";

export enum Step {
  AST = "ast",
  IR = "ir",
}

const format = {
  [Step.AST]: (ast: any) => JSON.stringify(ast, null, 2),
  [Step.IR]: (ir: any) => ir.build(),
};

const ending = {
  [Step.AST]: ".ast.json",
  [Step.IR]: ".ir.ll",
};

export default function writeStep(step: Step, name: string, data: any) {
  const formatted = format[step](data);

  const root = getCwd();

  const file_path = `${root}/output/${name}${ending[step]}`;

  writeFileSync(file_path, formatted, "utf-8");
}
