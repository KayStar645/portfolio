const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const buildRoot = path.join(root, 'dist', 'portfolio');
const fail = message => { throw new Error(message); };
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const flattenKeys = (value, prefix = '') => Object.entries(value).flatMap(([key, child]) => {
  const pathKey = prefix ? `${prefix}.${key}` : key;
  return child && typeof child === 'object' && !Array.isArray(child) ? flattenKeys(child, pathKey) : [pathKey];
});

const indexPath = path.join(buildRoot, 'index.html');
if (!fs.existsSync(indexPath)) fail('Production index.html is missing');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
if (!/<base href="\/portfolio\/">/.test(indexHtml)) fail('Production base href must be /portfolio/');

const locales = ['en-US', 'vi-VN'];
const translations = locales.map(locale => {
  const file = path.join(buildRoot, 'assets', 'i18n', `${locale}.json`);
  if (!fs.existsSync(file)) fail(`Built translation file is missing: ${locale}`);
  return readJson(file);
});
const enKeys = flattenKeys(translations[0]).sort();
const viKeys = flattenKeys(translations[1]).sort();
if (JSON.stringify(enKeys) !== JSON.stringify(viKeys)) fail('Built translation locale parity failed');

for (const locale of locales) {
  for (const fileName of ['project.json', 'experience.json', 'skill.json', 'achievement.json', 'education.json', 'resume.json']) {
    const file = path.join(buildRoot, 'assets', 'params', 'json', locale, fileName);
    if (!fs.existsSync(file)) fail(`Built content file is missing: ${locale}/${fileName}`);
    readJson(file);
  }
  const pdf = path.join(buildRoot, 'assets', 'files', `resume-${locale}.pdf`);
  if (!fs.existsSync(pdf) || fs.statSync(pdf).size === 0) fail(`Built resume PDF is missing: ${locale}`);
}

const templateFiles = [];
const collectTemplates = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) collectTemplates(file);
    else if (entry.name.endsWith('.html')) templateFiles.push(file);
  }
};
collectTemplates(path.join(root, 'src', 'app'));
const knownKeys = new Set(enKeys);
for (const file of templateFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/['"]([a-z][\w-]*(?:\.[\w-]+)+)['"]\s*\|\s*translate/g)) {
    if (!knownKeys.has(match[1])) fail(`Template translation key is missing: ${match[1]} in ${path.relative(root, file)}`);
  }
}

console.log(`Validated production build with ${enKeys.length} parity-matched translation keys and all locale assets.`);
