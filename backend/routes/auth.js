// ─── routes/auth.js ──────────────────────────────────────────────────────────
const authRouter = require('express').Router();
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, me);
module.exports = authRouter;
