const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'dist', 'portfolio');
const browserDir = path.join(outputDir, 'browser');

if (!fs.existsSync(browserDir)) {
  throw new Error(`Angular browser output not found: ${browserDir}`);
}

for (const entry of fs.readdirSync(browserDir)) {
  const source = path.join(browserDir, entry);
  const destination = path.join(outputDir, entry);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.renameSync(source, destination);
}

fs.rmSync(browserDir, { recursive: true, force: true });
console.log(`Finalized static build in ${outputDir}`);
