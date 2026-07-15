const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const readJson = (locale, file) => JSON.parse(fs.readFileSync(path.join(root, 'src', 'assets', 'params', 'json', locale, file), 'utf8'));
const fail = message => { throw new Error(message); };
const same = (label, left, right) => { if (JSON.stringify(left) !== JSON.stringify(right)) fail(`${label} locale parity failed`); };
const flattenKeys = (value, prefix = '') => Object.entries(value).flatMap(([key, child]) => {
  const pathKey = prefix ? `${prefix}.${key}` : key;
  return child && typeof child === 'object' && !Array.isArray(child) ? flattenKeys(child, pathKey) : [pathKey];
});

const enUi = JSON.parse(fs.readFileSync(path.join(root, 'public', 'i18n', 'en-US.json'), 'utf8'));
const viUi = JSON.parse(fs.readFileSync(path.join(root, 'public', 'i18n', 'vi-VN.json'), 'utf8'));
same('UI translation keys', flattenKeys(enUi).sort(), flattenKeys(viUi).sort());

const enProjects = readJson('en-US', 'project.json');
const viProjects = readJson('vi-VN', 'project.json');
same('Project IDs', enProjects.map(x => x.id), viProjects.map(x => x.id));
same('Project slugs', enProjects.map(x => x.slug), viProjects.map(x => x.slug));
same('Project status', enProjects.map(x => x.status), viProjects.map(x => x.status));
same('Project technologies', enProjects.map(x => x.technologies), viProjects.map(x => x.technologies));
same('Project section structure', enProjects.map(x => [x.overviewFacts.length, x.problem.constraints.length, x.process.length, x.decisions.length, x.solution.length, x.outcomes.length, x.learnings.length]), viProjects.map(x => [x.overviewFacts.length, x.problem.constraints.length, x.process.length, x.decisions.length, x.solution.length, x.outcomes.length, x.learnings.length]));
for (const project of [...enProjects, ...viProjects]) {
  if (!project.problem?.statement || !project.decisions?.length || !project.outcomes?.length || !project.learnings?.length) fail(`Incomplete project: ${project.slug}`);
  if ('company' in project || 'location' in project) fail(`Project contains employment identity: ${project.slug}`);
}
if (!enProjects[0]?.featured || enProjects[0]?.slug !== 'enterprise-platform-architecture') fail('Flagship project must be first');

const enExperience = readJson('en-US', 'experience.json');
const viExperience = readJson('vi-VN', 'experience.json');
same('Experience IDs/status', enExperience.map(x => [x.id, x.status]), viExperience.map(x => [x.id, x.status]));
same('Experience technologies', enExperience.map(x => x.technologies), viExperience.map(x => x.technologies));

const enSkills = readJson('en-US', 'skill.json');
const viSkills = readJson('vi-VN', 'skill.json');
same('Skills', enSkills.map(x => [x.group_id, x.name, x.is_main, x.is_hidden]), viSkills.map(x => [x.group_id, x.name, x.is_main, x.is_hidden]));

const enAchievements = readJson('en-US', 'achievement.json');
const viAchievements = readJson('vi-VN', 'achievement.json');
same('Achievement records', enAchievements.map(x => [x.id, x.type, x.time]), viAchievements.map(x => [x.id, x.type, x.time]));
for (const [locale, achievements] of [['en-US', enAchievements], ['vi-VN', viAchievements]]) {
  if (achievements.filter(x => x.type === 'prize').length !== 6) fail(`${locale} must contain six awards`);
  if (achievements.filter(x => x.type === 'science').length !== 3) fail(`${locale} must contain three research projects`);
  for (const item of achievements) {
    if (!item.id || !item.name || !item.role || !item.result || !item.address || !item.time) fail(`Incomplete achievement: ${locale}/${item.id}`);
  }
}
for (const locale of ['en-US', 'vi-VN']) {
  const resume = readJson(locale, 'resume.json');
  if ('achievements' in resume || 'research' in resume) fail(`${locale} resume duplicates canonical achievement data`);
}
const enEducation = readJson('en-US', 'education.json');
const viEducation = readJson('vi-VN', 'education.json');
same('Education IDs', enEducation.education.map(x => x.id), viEducation.education.map(x => x.id));
same('Certificate IDs', enEducation.certificates.map(x => x.id), viEducation.certificates.map(x => x.id));

const publicTextFiles = [
  'public/i18n/en-US.json', 'public/i18n/vi-VN.json',
  ...['en-US', 'vi-VN'].flatMap(locale => ['project.json', 'experience.json', 'skill.json', 'achievement.json', 'education.json', 'resume.json'].map(file => `src/assets/params/json/${locale}/${file}`)),
  'KayStar645/README.md',
];
const publicText = publicTextFiles.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
for (const term of ['SharePoint', 'Current platform flow', 'Luồng nền tảng hiện tại', 'AI/OCR', 'OCR/AI', 'Observability', 'architectureStages', 'architecture-flow']) {
  if (publicText.toLowerCase().includes(term.toLowerCase())) fail(`Forbidden public term: ${term}`);
}
if (/\bSenior\b/i.test(publicText)) fail('Forbidden public title: Senior');

const readme = fs.readFileSync(path.join(root, 'KayStar645', 'README.md'), 'utf8');
for (const pattern of [/Vũ Thảo|Vu Thao/i, /COGAIN|GOSOFT|TURBO/i, /\bDPM\b/i, /SharePoint/i, /migrat/i, /<a id="zhongwen"/i, /```mermaid/i]) {
  if (pattern.test(readme)) fail(`README privacy/language rule failed: ${pattern}`);
}
const declaredAnchors = new Set([...readme.matchAll(/<a id="([^"]+)"/g)].map(match => match[1]));
for (const match of readme.matchAll(/href="#([^"]+)"/g)) {
  if (!declaredAnchors.has(match[1])) fail(`README anchor target missing: ${match[1]}`);
}
if ((readme.match(/^## (English|Tiếng Việt)$/gm) || []).length !== 2) fail('README must contain exactly English and Vietnamese sections');
for (const term of ['MFE', 'Feature-Sliced Design', 'Microservices', 'Clean Architecture', 'DDD', 'CQRS']) {
  if (!publicText.includes(term)) fail(`Required architecture term missing: ${term}`);
}

console.log(`Validated ${flattenKeys(enUi).length} UI translations, ${enProjects.length} projects, ${enExperience.length} experiences, ${enSkills.length} skills, ${enAchievements.length} achievements and ${enEducation.education.length} education records across EN/VI.`);
