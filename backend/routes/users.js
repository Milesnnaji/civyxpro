// ─── routes/users.js ─────────────────────────────────────────────────────────
const userRouter = require('express').Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/userController');

const avatarStorage = multer.diskStorage({
  destination: 'uploads/avatars/',
  filename: (req, file, cb) => cb(null, `avatar-${req.user._id}-${Date.now()}${require('path').extname(file.originalname)}`),
});
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 2 * 1024 * 1024 } });

userRouter.use(protect);
userRouter.get('/profile', getProfile);
userRouter.put('/profile', uploadAvatar.single('avatar'), updateProfile);
userRouter.delete('/profile', deleteAccount);

module.exports = userRouter;
