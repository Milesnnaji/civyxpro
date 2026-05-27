const { Resume } = require('../models');
const puppeteer = require('puppeteer');

// GET /api/resumes
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resumes/:id
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/resumes
exports.createResume = async (req, res) => {
  try {
    const { name, templateId, data } = req.body;
    const resume = await Resume.create({ userId: req.user._id, name: name || 'Untitled', templateId, data });
    res.status(201).json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/resumes/:id
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/resumes/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resumes/:id/pdf  — requires verified payment
exports.generatePDF = async (req, res) => {
  try {
    const { Payment } = require('../models');
    const paid = await Payment.findOne({ userId: req.user._id, itemId: req.params.id, status: 'success' });
    if (!paid) return res.status(403).json({ message: 'Payment required to download PDF' });

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const html = buildResumeHTML(resume.data, resume.templateId);

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${resume.name || 'resume'}.pdf"` });
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── HTML TEMPLATE BUILDER ────────────────────────────────────────────────────
function buildResumeHTML(data, templateId) {
  const accents = { modern: '#6C63FF', minimal: '#00D4AA', executive: '#F5C542', developer: '#FF6B9D', creative: '#4ECDC4' };
  const accent = accents[templateId] || accents.modern;
  const d = data || {};

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #111; padding: 40px 48px; line-height: 1.5; }
    h1 { font-size: 22pt; font-family: sans-serif; font-weight: 700; color: #111; letter-spacing: -0.5px; }
    .meta { font-size: 9pt; color: #555; font-family: sans-serif; margin-top: 4px; display: flex; gap: 16px; flex-wrap: wrap; }
    .divider { border: none; border-top: 2px solid ${accent}; margin: 10px 0 14px; }
    .section-title { font-size: 10pt; font-weight: 700; color: ${accent}; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .section { margin-bottom: 16px; }
    .exp-row { display: flex; justify-content: space-between; font-family: sans-serif; }
    .exp-role { font-weight: 700; font-size: 10pt; }
    .exp-company { font-size: 9pt; color: #444; font-family: sans-serif; margin-bottom: 3px; }
    .exp-date { font-size: 9pt; color: #666; }
    .bullet { font-size: 9.5pt; padding-left: 14px; color: #333; margin-bottom: 2px; }
    .bullet::before { content: "•"; margin-right: 6px; }
    .skills { font-size: 10pt; color: #333; }
  </style></head><body>
  <h1>${d.name || ''}</h1>
  <div class="meta">
    ${d.email ? `<span>${d.email}</span>` : ''}
    ${d.phone ? `<span>${d.phone}</span>` : ''}
    ${d.location ? `<span>${d.location}</span>` : ''}
    ${d.linkedin ? `<span>LinkedIn: ${d.linkedin}</span>` : ''}
    ${d.github ? `<span>GitHub: ${d.github}</span>` : ''}
  </div>
  <hr class="divider">
  ${d.summary ? `<div class="section"><div class="section-title">Summary</div><p style="font-size:10pt">${d.summary}</p></div>` : ''}
  ${d.skills?.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${d.skills.join(' · ')}</div></div>` : ''}
  ${d.experience?.length ? `<div class="section"><div class="section-title">Experience</div>${d.experience.map(e => `
    <div style="margin-bottom:10px">
      <div class="exp-row"><span class="exp-role">${e.role || ''}</span><span class="exp-date">${e.dates || ''}</span></div>
      <div class="exp-company">${e.company || ''}${e.location ? ` — ${e.location}` : ''}</div>
      ${(e.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
    </div>`).join('')}</div>` : ''}
  ${d.education?.length ? `<div class="section"><div class="section-title">Education</div>${d.education.map(e => `
    <div style="margin-bottom:8px">
      <div class="exp-row"><span class="exp-role">${e.school || ''}</span><span class="exp-date">${e.dates || ''}</span></div>
      <div class="exp-company">${e.degree || ''}${e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>
      ${e.coursework ? `<div style="font-size:9pt;color:#555">Coursework: ${e.coursework}</div>` : ''}
    </div>`).join('')}</div>` : ''}
  ${d.projects?.length ? `<div class="section"><div class="section-title">Projects</div>${d.projects.map(p => `
    <div style="margin-bottom:8px">
      <div style="font-weight:700;font-size:10pt;font-family:sans-serif">${p.name || ''}</div>
      <div style="font-size:9.5pt">${p.desc || ''}</div>
      ${p.tech ? `<div style="font-size:9pt;color:#555;font-family:sans-serif">Tech: ${p.tech}</div>` : ''}
    </div>`).join('')}</div>` : ''}
  ${d.certifications?.length ? `<div class="section"><div class="section-title">Certifications</div>${d.certifications.map(c => `<div class="bullet">${c}</div>`).join('')}</div>` : ''}
  </body></html>`;
}
