const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  stripeCreateSession, stripeWebhook,
  paystackInit, paystackVerify,
  flutterwaveInit, flutterwaveVerify,
  getHistory,
} = require('../controllers/paymentController');

// Stripe
router.post('/stripe/create-session', protect, stripeCreateSession);
router.post('/stripe/webhook', stripeWebhook); // No protect — Stripe calls this

// Paystack
router.post('/paystack/initialize', protect, paystackInit);
router.get('/paystack/verify/:reference', protect, paystackVerify);

// Flutterwave
router.post('/flutterwave/initialize', protect, flutterwaveInit);
router.get('/flutterwave/verify', protect, flutterwaveVerify);

// History
router.get('/history', protect, getHistory);

module.exports = router;
