const { User, Template } = require('../models');
const path = require('path');

// ─── USER CONTROLLER ──────────────────────────────────────────────────────────

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (req.file) updates.avatar = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/profile
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── TEMPLATE CONTROLLER ─────────────────────────────────────────────────────

// GET /api/templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/templates  (admin only)
exports.createTemplate = async (req, res) => {
  try {
    const { name, slug, isPremium, category, accent, desc } = req.body;
    const filePath = req.file ? `/uploads/templates/${req.file.filename}` : '';
    const template = await Template.create({ name, slug, isPremium, category, accent, desc, filePath, uploadedBy: req.user._id });
    res.status(201).json({ template });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/templates/:id (admin only)
exports.deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
