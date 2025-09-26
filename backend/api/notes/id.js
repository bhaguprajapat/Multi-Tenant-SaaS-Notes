// api/notes/[id].js
const { connect } = require('../../lib/db');
const Note = require('../../lib/models/Note');
const { requireAuth } = require('../../lib/auth');
const { setCors } = require('../../lib/cors');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAuth(req, res);
  if (!auth) return;
  const { user } = auth;
  const tenantSlug = user.tenantSlug;

  const { id } = req.query;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

  await connect();

  const note = await Note.findOne({ _id: id, tenantSlug });
  if (!note) return res.status(404).json({ error: 'Note not found' });

  if (req.method === 'GET') {
    return res.json(note);
  }

  if (req.method === 'PUT') {
    // Only allow users in same tenant to edit — role doesn't restrict edit per requirements (members may edit)
    const { title, body } = req.body || {};
    if (title !== undefined) note.title = title;
    if (body !== undefined) note.body = body;
    await note.save();
    return res.json(note);
  }

  if (req.method === 'DELETE') {
    await note.remove();
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
