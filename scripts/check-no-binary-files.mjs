import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const output = execFileSync("git", ["ls-files", "-z"], { encoding: "buffer" });
const files = output.toString("utf8").split("\0").filter(Boolean);
const binaryFiles = [];

for (const file of files) {
  if (!existsSync(file)) continue;
  const bytes = readFileSync(file);
  if (bytes.subarray(0, 8192).includes(0)) {
    binaryFiles.push(file);
  }
}

if (binaryFiles.length > 0) {
  console.error("Binary files are not supported in this repository workflow:");
  for (const file of binaryFiles) console.error(`- ${file}`);
  console.error("Use text-native assets such as SVG instead of PNG/JPEG/WebP binaries.");
  process.exit(1);
}

console.log(`No binary files detected across ${files.length} tracked files.`);
