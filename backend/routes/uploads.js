const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');

const resumeStorage = multer.diskStorage({
  destination: 'uploads/resumes/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

const upload = multer({
  storage: resumeStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only PDF and Word documents allowed'));
  },
});

// POST /api/uploads/resume  — admin uploads a premium resume to marketplace
router.post('/resume', protect, adminOnly, upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ path: `/uploads/resumes/${req.file.filename}`, filename: req.file.originalname });
});

module.exports = router;
