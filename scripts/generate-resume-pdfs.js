const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public', 'files');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-resume-'));

const labels = {
  'vi-VN': {
    fileName: 'resume-vi-VN.pdf',
    documentTitle: 'CV - Pham Tan Thuan - Full-stack .NET React Developer',
    focus: 'Full-stack .NET/React Developer',
    summary: 'Tóm tắt',
    coreSkills: 'Công nghệ chính',
    experience: 'Kinh nghiệm làm việc',
    education: 'Học vấn',
    certificates: 'Chứng chỉ',
    research: 'Hướng nghiên cứu',
    highlights: 'Điểm nổi bật chuyên môn',
    languages: 'Ngôn ngữ',
  },
  'en-US': {
    fileName: 'resume-en-US.pdf',
    documentTitle: 'CV - Pham Tan Thuan - Full-stack .NET React Developer',
    focus: 'Full-stack .NET/React Developer',
    summary: 'Summary',
    coreSkills: 'Core Technologies',
    experience: 'Professional Experience',
    education: 'Education',
    certificates: 'Certificates',
    research: 'Research Interests',
    highlights: 'Professional Highlights',
    languages: 'Languages',
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function chromePath() {
  const candidates = [
    process.env.CHROME_BIN,
    path.join(process.env.ProgramFiles || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env.ProgramFiles || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  ].filter(Boolean);

  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) {
    throw new Error('Chrome or Edge executable was not found. Set CHROME_BIN to generate resume PDFs.');
  }

  return found;
}

function contactText(resume) {
  const contactParts = resume.profile.contacts.map(contact => `${contact.label}: ${displayContactValue(contact)}`);
  return [...contactParts, resume.profile.location].join(' | ');
}

function displayContactValue(contact) {
  if (contact.href?.startsWith('mailto:')) {
    return contact.href.replace('mailto:', '');
  }

  if (contact.href?.startsWith('http')) {
    return contact.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }

  return contact.value;
}

function skillGroups(groups) {
  return groups
    .map(group => `
      <div class="skill-group">
        <h3>${escapeHtml(group.title)}</h3>
        <p>${group.items.map(escapeHtml).join(' | ')}</p>
      </div>`)
    .join('');
}

function experienceItem(item) {
  return `
    <article class="experience-item">
      <div class="item-head">
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <strong>${escapeHtml(item.organization)}</strong>
        </div>
        <span>${escapeHtml(item.period)}</span>
      </div>
      <ul>
        ${item.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}
      </ul>
    </article>`;
}

function simpleItems(items) {
  return items
    .map(item => `
      <article class="simple-item">
        <div class="simple-head">
          <h3>${escapeHtml(item.title)}</h3>
          ${item.period ? `<span>${escapeHtml(item.period)}</span>` : ''}
        </div>
        ${item.subtitle ? `<strong>${escapeHtml(item.subtitle)}</strong>` : ''}
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
      </article>`)
    .join('');
}

function renderHtml(lang, resume) {
  const text = labels[lang];

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(text.documentTitle)}</title>
  <style>
    @page { size: A4; margin: 12mm 13mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #111827;
      background: #ffffff;
      font-family: Arial, "Segoe UI", sans-serif;
      font-size: 10.5px;
      line-height: 1.38;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    header {
      border-bottom: 1.5px solid #0f766e;
      padding-bottom: 7px;
      margin-bottom: 9px;
    }
    h1, h2, h3, p { margin: 0; }
    h1 {
      color: #0f172a;
      font-size: 25px;
      letter-spacing: 0;
      line-height: 1.08;
    }
    .focus {
      color: #0f766e;
      font-size: 13px;
      font-weight: 700;
      margin-top: 3px;
    }
    .subtitle {
      color: #334155;
      font-size: 10.8px;
      margin-top: 2px;
    }
    .contacts {
      color: #475569;
      font-size: 9.2px;
      margin-top: 5px;
      overflow-wrap: anywhere;
    }
    .resume > section { margin-top: 9px; }
    h2 {
      color: #0f766e;
      font-size: 12.5px;
      text-transform: uppercase;
      letter-spacing: 0;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 2px;
      margin-bottom: 5px;
    }
    h3 {
      color: #111827;
      font-size: 10.8px;
      line-height: 1.22;
    }
    p { color: #334155; }
    ul {
      margin: 4px 0 0;
      padding-left: 14px;
    }
    li { margin-bottom: 2.2px; }
    .skill-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 5px 9px;
    }
    .skill-group h3 {
      color: #0f172a;
      font-size: 10px;
      margin-bottom: 1px;
    }
    .skill-group p { font-size: 9.5px; }
    .experience-item {
      margin-bottom: 7px;
      break-inside: avoid;
    }
    .item-head,
    .simple-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: flex-start;
    }
    .item-head span,
    .simple-head span {
      color: #64748b;
      white-space: nowrap;
      font-size: 9.5px;
      font-weight: 700;
    }
    .item-head strong,
    .simple-item strong {
      color: #334155;
      display: block;
      font-size: 9.8px;
      margin-top: 1px;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
    }
    .simple-item {
      margin-bottom: 6px;
      break-inside: avoid;
    }
    .simple-item p { margin-top: 2px; }
    .compact-list {
      display: grid;
      gap: 5px;
    }
    .language-list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 5px;
    }
    .language-item {
      border: 1px solid #d1d5db;
      padding: 5px 6px;
      border-radius: 4px;
    }
    .language-item strong {
      display: block;
      font-size: 10px;
    }
    .language-item span {
      color: #475569;
      font-size: 9.2px;
    }
  </style>
</head>
<body>
  <main class="resume">
    <header>
      <h1>${escapeHtml(resume.profile.name)}</h1>
      <p class="focus">${escapeHtml(text.focus)}</p>
      <p class="subtitle">${escapeHtml(resume.profile.title)}</p>
      <p class="contacts">${escapeHtml(contactText(resume))}</p>
    </header>

    <section>
      <h2>${escapeHtml(text.summary)}</h2>
      <p>${escapeHtml(resume.summary)}</p>
    </section>

    <section>
      <h2>${escapeHtml(text.coreSkills)}</h2>
      <div class="skill-grid">${skillGroups(resume.skillGroups)}</div>
    </section>

    <section>
      <h2>${escapeHtml(text.experience)}</h2>
      ${resume.experiences.map(experienceItem).join('')}
    </section>

    <div class="two-col">
      <section>
        <h2>${escapeHtml(text.education)}</h2>
        ${simpleItems(resume.education)}
      </section>
      <section>
        <h2>${escapeHtml(text.certificates)}</h2>
        ${simpleItems(resume.certificates)}
      </section>
    </div>

    <section>
      <h2>${escapeHtml(text.highlights)}</h2>
      <div class="compact-list">${simpleItems(resume.achievements)}</div>
    </section>

    <section>
      <h2>${escapeHtml(text.research)}</h2>
      <div class="compact-list">${simpleItems(resume.research)}</div>
    </section>

    <section>
      <h2>${escapeHtml(text.languages)}</h2>
      <div class="language-list">
        ${resume.languages
          .map(language => `
            <div class="language-item">
              <strong>${escapeHtml(language.name)}</strong>
              <span>${escapeHtml(language.level)}</span>
            </div>`)
          .join('')}
      </div>
    </section>
  </main>
</body>
</html>`;
}

function generate(lang) {
  const resumePath = path.join(root, 'src', 'assets', 'params', 'json', lang, 'resume.json');
  const resume = readJson(resumePath);
  const htmlPath = path.join(tempDir, `resume-${lang}.html`);
  const pdfPath = path.join(outputDir, labels[lang].fileName);

  fs.writeFileSync(htmlPath, renderHtml(lang, resume), 'utf8');
  execFileSync(chromePath(), [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--no-pdf-header-footer',
    '--print-to-pdf-no-header',
    `--print-to-pdf=${pdfPath}`,
    `file:///${htmlPath.replace(/\\/g, '/')}`,
  ], { stdio: 'inherit' });

  const signature = fs.readFileSync(pdfPath).subarray(0, 5).toString('ascii');
  if (!signature.startsWith('%PDF-')) {
    throw new Error(`Generated file is not a PDF: ${pdfPath}`);
  }

  const stats = fs.statSync(pdfPath);
  if (stats.size <= 0) {
    throw new Error(`Generated PDF is empty: ${pdfPath}`);
  }

  console.log(`${labels[lang].fileName}: ${stats.size} bytes`);
}

try {
  fs.mkdirSync(outputDir, { recursive: true });
  generate('vi-VN');
  generate('en-US');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
