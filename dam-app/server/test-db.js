require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tasks = await prisma.task.findMany({
        where: { isCompleted: true }
    });
    console.log(JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, note: t.completionNote })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
