const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── USER MODEL ───────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  avatar:    { type: String, default: '' },
  isAdmin:   { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ─── RESUME MODEL ─────────────────────────────────────────────────────────────
const resumeSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, default: 'Untitled Resume' },
  templateId: { type: String, default: 'modern' },
  data: {
    name:           String,
    email:          String,
    phone:          String,
    location:       String,
    linkedin:       String,
    github:         String,
    summary:        String,
    skills:         [String],
    experience: [{
      role:     String,
      company:  String,
      location: String,
      dates:    String,
      bullets:  [String],
    }],
    education: [{
      school:     String,
      degree:     String,
      dates:      String,
      gpa:        String,
      coursework: String,
    }],
    projects: [{
      name: String,
      desc: String,
      tech: String,
      link: String,
    }],
    certifications: [String],
  },
}, { timestamps: true });

// ─── TEMPLATE MODEL ───────────────────────────────────────────────────────────
const templateSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  slug:      { type: String, required: true, unique: true },
  isPremium: { type: Boolean, default: false },
  category:  { type: String, default: 'general' },
  accent:    { type: String, default: '#6C63FF' },
  desc:      { type: String, default: '' },
  filePath:  { type: String, default: '' }, // for uploaded premium resumes
  downloads: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ─── PAYMENT MODEL ────────────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:    { type: Number, required: true },
  currency:  { type: String, default: 'USD' },
  provider:  { type: String, enum: ['stripe', 'paystack', 'flutterwave'], required: true },
  status:    { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  reference: { type: String, required: true, unique: true },
  item:      { type: String, default: 'Resume Download' },
  itemId:    { type: String, default: '' },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = {
  User:     mongoose.model('User', userSchema),
  Resume:   mongoose.model('Resume', resumeSchema),
  Template: mongoose.model('Template', templateSchema),
  Payment:  mongoose.model('Payment', paymentSchema),
};
