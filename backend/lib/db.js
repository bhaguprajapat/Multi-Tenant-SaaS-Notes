// lib/db.js
const mongoose = require('mongoose');

let cached = global._mongoCache;

if (!cached) {
  cached = global._mongoCache = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connect };
