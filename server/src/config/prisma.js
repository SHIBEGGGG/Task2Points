// A single shared Prisma Client instance. Importing this file anywhere in
// the app reuses the same connection pool instead of opening a new one.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
