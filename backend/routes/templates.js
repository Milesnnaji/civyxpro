// ─── routes/templates.js ─────────────────────────────────────────────────────
const templateRouter = require('express').Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/auth');
const { getTemplates, createTemplate, deleteTemplate } = require('../controllers/userController');

const templateStorage = multer.diskStorage({
  destination: 'uploads/templates/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const uploadTemplate = multer({ storage: templateStorage, limits: { fileSize: 10 * 1024 * 1024 } });

templateRouter.get('/', getTemplates);
templateRouter.post('/', protect, adminOnly, uploadTemplate.single('file'), createTemplate);
templateRouter.delete('/:id', protect, adminOnly, deleteTemplate);

module.exports = templateRouter;
