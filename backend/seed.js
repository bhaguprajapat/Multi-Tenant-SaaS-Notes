// seed.js
const bcrypt = require('bcryptjs');
const { connect } = require('./lib/db');
const Tenant = require('./lib/models/Tenant');
const User = require('./lib/models/User');
const Note = require('./lib/models/Note');

async function run() {
  await connect();
  console.log('Connected to DB');

  // Upsert tenants
  const tenants = [
    { name: 'Acme', slug: 'acme', plan: 'free' },
    { name: 'Globex', slug: 'globex', plan: 'free' }
  ];

  for (const t of tenants) {
    await Tenant.updateOne({ slug: t.slug }, { $set: t }, { upsert: true });
  }

  // Clear users and notes for clean seed (optional)
  await User.deleteMany({ email: /@acme.test|@globex.test/ });
  // Create users
  const pw = await bcrypt.hash('password', 10);

  const users = [
    { email: 'admin@acme.test', passwordHash: pw, role: 'admin', tenantSlug: 'acme' },
    { email: 'user@acme.test', passwordHash: pw, role: 'member', tenantSlug: 'acme' },
    { email: 'admin@globex.test', passwordHash: pw, role: 'admin', tenantSlug: 'globex' },
    { email: 'user@globex.test', passwordHash: pw, role: 'member', tenantSlug: 'globex' }
  ];

  for (const u of users) {
    await User.updateOne({ email: u.email }, { $set: u }, { upsert: true });
  }

  // optionally seed a note for acme and globex
  await Note.deleteMany({}); // start fresh
  await Note.create({ title: 'Welcome — Acme note', body: 'Hello Acme', tenantSlug: 'acme' });
  await Note.create({ title: 'Welcome — Globex note', body: 'Hello Globex', tenantSlug: 'globex' });

  console.log('Seed complete');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
