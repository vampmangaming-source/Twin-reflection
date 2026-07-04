/**
 * Run this once after placing your files in public/assets/:
 *   node scripts/patch-assets.js
 *
 * It rewrites every src/assets/*.asset.json so the `url` field
 * points to /assets/<filename> (served from public/assets/ by Vite).
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, resolve } from "path";

const assetsDir = resolve("src/assets");
const files = readdirSync(assetsDir).filter((f) => f.endsWith(".asset.json"));

for (const file of files) {
  const filePath = join(assetsDir, file);
  const json = JSON.parse(readFileSync(filePath, "utf8"));
  const localUrl = `/assets/${json.original_filename}`;
  if (json.url === localUrl) {
    console.log(`  already patched: ${file}`);
    continue;
  }
  json.url = localUrl;
  writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n");
  console.log(`  patched: ${file}  →  ${localUrl}`);
}

console.log("\nDone. Make sure public/assets/ contains all the original files.");
