// lib/models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String },
  tenantSlug: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);
