// lib/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','member'], default: 'member' },
  tenantSlug: { type: String, required: true } // e.g., "acme"
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
