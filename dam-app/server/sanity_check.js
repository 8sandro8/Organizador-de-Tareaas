require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

console.log('--- ENVIROMENT CHECK ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('PWD:', process.cwd());

const dbRelativePath = process.env.DATABASE_URL.replace('file:', '');
const dbPath = path.resolve(process.cwd(), dbRelativePath);

console.log('RESOLVED DB PATH:', dbPath);

if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log('DB FILE EXISTS! Size:', stats.size, 'bytes');
} else {
    console.log('DB FILE DOES NOT EXIST at:', dbPath);
    // List files in the parent dir of the expected path
    const parentDir = path.dirname(dbPath);
    if (fs.existsSync(parentDir)) {
        console.log('Listing files in parent dir:', parentDir);
        console.log(fs.readdirSync(parentDir));
    }
}

const prisma = new PrismaClient();

async function testConnection() {
    console.log('--- PRISMA TEST ---');
    try {
        const count = await prisma.subject.count();
        console.log('Connection successful! Total subjects:', count);
        const subjects = await prisma.subject.findMany({ select: { id: true, name: true, code: true } });
        console.log('Subjects:', subjects);
    } catch (err) {
        console.error('Prisma test failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
