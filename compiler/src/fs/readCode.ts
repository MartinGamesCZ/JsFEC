import path from "path";
import { getCwd } from "./util";
import { readFileSync } from "fs";

export default function readCode(p: string) {
  const root = getCwd();

  const file_path = path.join(root, p);

  return readFileSync(file_path, "utf-8");
}
