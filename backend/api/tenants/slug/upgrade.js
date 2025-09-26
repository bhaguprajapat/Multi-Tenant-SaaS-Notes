// api/tenants/[slug]/upgrade.js
const { connect } = require('../../../lib/db');
const Tenant = require('../../../lib/models/Tenant');
const { requireAuth } = require('../../../lib/auth');
const { setCors } = require('../../../lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  const auth = await requireAuth(req, res);
  if (!auth) return; // requireAuth already set response

  const { user } = auth;
  if (user.role !== 'admin') return res.status(403).json({ error: 'Only admin can upgrade tenant' });
  if (user.tenantSlug !== slug) return res.status(403).json({ error: 'Admin can only upgrade their tenant' });

  await connect();
  const tenant = await Tenant.findOne({ slug });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  tenant.plan = 'pro';
  await tenant.save();

  res.json({ ok: true, message: `${slug} upgraded to pro` });
};
