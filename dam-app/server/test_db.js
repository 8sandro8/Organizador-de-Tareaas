const path = require('path');
const { PrismaClient } = require('@prisma/client');

const basePath = __dirname;
const dbPath = path.join(basePath, 'prisma/dev.db').replace(/\\/g, '/');
const url = 'file:' + dbPath;

console.log('BasePath:', basePath);
console.log('dbPath:', dbPath);
console.log('URL:', url);

const p = new PrismaClient({ datasources: { db: { url } } });

p.$connect()
  .then(() => p.subject.findMany())
  .then(r => { console.log('Subjects:', r.length); return p.$disconnect(); })
  .catch(e => console.error('Error:', e.message))
  .finally(() => process.exit(0));
