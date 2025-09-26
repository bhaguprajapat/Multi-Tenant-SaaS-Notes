// api/auth/login.js
const bcrypt = require('bcryptjs');
const { connect } = require('../../lib/db');
const User = require('../../lib/models/User');
const Tenant = require('../../lib/models/Tenant');
const { signToken } = require('../../lib/auth');
const { setCors } = require('../../lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email + password required' });

  await connect();
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  // ensure tenant exists (defensive)
  const tenant = await Tenant.findOne({ slug: user.tenantSlug });
  if (!tenant) return res.status(500).json({ error: 'Tenant not found' });

  const token = signToken({ userId: user._id, role: user.role, tenantSlug: user.tenantSlug });

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      tenantSlug: user.tenantSlug,
      tenantPlan: tenant.plan
    }
  });
};
