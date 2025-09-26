# Notes SaaS Backend

Multi-tenant approach: shared schema with `tenantSlug` field on User and Note.

Env vars:
- MONGODB_URI: MongoDB Atlas connection string
- JWT_SECRET: secret string used to sign tokens

Seed:
- `npm run seed` to create tenants and test users:
  admin@acme.test / password
  user@acme.test / password
  admin@globex.test / password
  user@globex.test / password
