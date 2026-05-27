const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment } = require('../models');

// ─── STRIPE ───────────────────────────────────────────────────────────────────

// POST /api/payments/stripe/create-session
exports.stripeCreateSession = async (req, res) => {
  try {
    const { itemId, itemName } = req.body;
    const reference = `stripe_${Date.now()}_${req.user._id}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'usd', product_data: { name: itemName || 'Resume Download' }, unit_amount: 100 }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard?payment=success&ref=${reference}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?payment=cancelled`,
      metadata: { userId: req.user._id.toString(), itemId, reference },
    });

    await Payment.create({ userId: req.user._id, amount: 1, currency: 'USD', provider: 'stripe', status: 'pending', reference, item: itemName, itemId });

    res.json({ url: session.url, reference });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/payments/stripe/webhook
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await Payment.findOneAndUpdate(
      { reference: session.metadata.reference },
      { status: 'success', metadata: session }
    );
  }
  res.json({ received: true });
};

// ─── PAYSTACK ─────────────────────────────────────────────────────────────────

// POST /api/payments/paystack/initialize
exports.paystackInit = async (req, res) => {
  try {
    const { itemId, itemName, email } = req.body;
    const reference = `pstk_${Date.now()}_${req.user._id}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email || req.user.email, amount: 100, reference, callback_url: `${process.env.CLIENT_URL}/dashboard?payment=success`, metadata: { itemId, itemName } }),
    });
    const data = await response.json();
    if (!data.status) throw new Error(data.message);

    await Payment.create({ userId: req.user._id, amount: 1, currency: 'NGN', provider: 'paystack', status: 'pending', reference, item: itemName, itemId });

    res.json({ url: data.data.authorization_url, reference });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/payments/paystack/verify/:reference
exports.paystackVerify = async (req, res) => {
  try {
    const { reference } = req.params;
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json();
    if (data.data?.status === 'success') {
      const payment = await Payment.findOneAndUpdate({ reference }, { status: 'success', metadata: data.data }, { new: true });
      return res.json({ success: true, payment });
    }
    res.json({ success: false, message: 'Payment not completed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── FLUTTERWAVE ──────────────────────────────────────────────────────────────

// POST /api/payments/flutterwave/initialize
exports.flutterwaveInit = async (req, res) => {
  try {
    const { itemId, itemName, email } = req.body;
    const tx_ref = `flw_${Date.now()}_${req.user._id}`;

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tx_ref, amount: 1, currency: 'USD',
        redirect_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
        customer: { email: email || req.user.email, name: req.user.name },
        customizations: { title: 'CivyxPro Resume Download', description: itemName },
      }),
    });
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message);

    await Payment.create({ userId: req.user._id, amount: 1, currency: 'USD', provider: 'flutterwave', status: 'pending', reference: tx_ref, item: itemName, itemId });

    res.json({ url: data.data.link, reference: tx_ref });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/payments/flutterwave/verify?transaction_id=xxx
exports.flutterwaveVerify = async (req, res) => {
  try {
    const { transaction_id } = req.query;
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
    });
    const data = await response.json();
    if (data.data?.status === 'successful') {
      const tx_ref = data.data.tx_ref;
      const payment = await Payment.findOneAndUpdate({ reference: tx_ref }, { status: 'success', metadata: data.data }, { new: true });
      return res.json({ success: true, payment });
    }
    res.json({ success: false, message: 'Payment not completed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── HISTORY ──────────────────────────────────────────────────────────────────

// GET /api/payments/history
exports.getHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
