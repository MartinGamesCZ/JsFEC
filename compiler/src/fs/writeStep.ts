import { writeFileSync } from "fs";
import { getCwd } from "./util";

export enum Step {
  AST = "ast",
}

const format = {
  [Step.AST]: (ast: any) => JSON.stringify(ast, null, 2),
};

export default function writeStep(step: Step, name: string, data: any) {
  const formatted = format[step](data);

  const root = getCwd();

  const file_path = `${root}/output/${name}.json`;

  writeFileSync(file_path, formatted, "utf-8");
}
