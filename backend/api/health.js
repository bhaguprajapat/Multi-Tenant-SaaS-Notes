// api/health.js
const { setCors } = require('../lib/cors');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json({ status: 'ok' });
};
