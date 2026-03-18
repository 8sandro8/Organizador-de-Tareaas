const path = require('path');
const { PrismaClient } = require('@prisma/client');

const getPrismaForUser = (userEnv) => {
    const basePath = userEnv === 'MI_PAREJA' 
        ? path.resolve(__dirname, '../../MI_PAREJA/dam-app/server')
        : __dirname;
    const dbPath = path.join(basePath, 'prisma/dev.db').replace(/\\/g, '/');
    console.log('Connecting to:', dbPath);
    return new PrismaClient({
        datasources: { db: { url: 'file:' + dbPath } }
    });
};

async function test() {
    const p = getPrismaForUser('MI_PAREJA');
    try {
        await p.$connect();
        const subjects = await p.subject.findMany();
        console.log('Connected! Subjects:', subjects.length);
        await p.$disconnect();
    } catch(e) {
        console.error('Error:', e.message);
    }
}
test();
