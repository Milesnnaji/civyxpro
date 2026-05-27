const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getResumes, getResume, createResume, updateResume, deleteResume, generatePDF } = require('../controllers/resumeController');

router.use(protect);
router.get('/', getResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.get('/:id/pdf', generatePDF);

module.exports = router;
