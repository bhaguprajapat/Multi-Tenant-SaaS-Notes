// lib/models/Tenant.js
const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., "acme"
  plan: { type: String, enum: ['free', 'pro'], default: 'free' }
}, { timestamps: true });

module.exports = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
