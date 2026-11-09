const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.resolve(projectRoot, "..");
const targetDir = path.resolve(projectRoot, "www");
const files = ["index.html", "styles.css", "app.js"];

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  const source = path.join(sourceDir, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source file: ${source}`);
  }
  fs.copyFileSync(source, path.join(targetDir, file));
}

console.log(`Copied ${files.join(", ")} -> ${targetDir}`);
