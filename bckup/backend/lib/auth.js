// lib/auth.js
const jwt = require('jsonwebtoken');
const { connect } = require('./db');
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// helper to parse bearer token from req headers
function getTokenFromReq(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
  return null;
}

async function requireAuth(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return null;
  }
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return null;
  }
  // Load user to ensure still valid
  await connect();
  const user = await User.findById(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'Invalid user' });
    return null;
  }
  // attach useful info
  return { user, payload };
}

module.exports = { signToken, verifyToken, getTokenFromReq, requireAuth };
