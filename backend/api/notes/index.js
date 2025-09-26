// api/notes/index.js
const { connect } = require('../../lib/db');
const Note = require('../../lib/models/Note');
const Tenant = require('../../lib/models/Tenant');
const { requireAuth } = require('../../lib/auth');
const { setCors } = require('../../lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth
  const auth = await requireAuth(req, res);
  if (!auth) return;
  const { user } = auth;
  const tenantSlug = user.tenantSlug;

  await connect();

  if (req.method === 'GET') {
    const notes = await Note.find({ tenantSlug }).sort({ createdAt: -1 });
    return res.json(notes);
  }

  if (req.method === 'POST') {
    // check role: both admins and members can create (requirements)
    const { title, body } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });

    // check tenant plan limit
    const tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) return res.status(500).json({ error: 'Tenant not found' });

    if (tenant.plan === 'free') {
      const count = await Note.countDocuments({ tenantSlug });
      if (count >= 3) {
        return res.status(403).json({ error: 'Note limit reached. Upgrade to Pro.' });
      }
    }

    const note = await Note.create({ title, body, tenantSlug, createdBy: user._id });
    return res.status(201).json(note);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
