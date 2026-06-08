import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const distAssets = join(process.cwd(), "dist", "assets");
const maxJsBytes = 1_500_000;
const errors = [];

if (!existsSync(distAssets)) {
  console.error("Bundle budget check requires a built dist/assets directory. Run npm run build first.");
  process.exit(1);
}

const jsFiles = readdirSync(distAssets).filter((file) => file.endsWith(".js"));
if (jsFiles.length === 0) {
  console.error("No JavaScript bundles found in dist/assets.");
  process.exit(1);
}

let total = 0;
let largest = { file: "", size: 0 };
for (const file of jsFiles) {
  const size = statSync(join(distAssets, file)).size;
  total += size;
  if (size > largest.size) largest = { file, size };
  if (size > maxJsBytes) errors.push(`${file} is ${(size / 1024).toFixed(1)} KiB, above ${(maxJsBytes / 1024).toFixed(1)} KiB.`);
}

console.log(`Bundle budget: ${jsFiles.length} JS files, total ${(total / 1024).toFixed(1)} KiB, largest ${largest.file} ${(largest.size / 1024).toFixed(1)} KiB, per-file limit ${(maxJsBytes / 1024).toFixed(1)} KiB.`);
console.log("Note: this sprint enforces the existing large-bundle ceiling; lowering the target remains a follow-up performance task.");

if (errors.length > 0) {
  console.error("Bundle budget check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
