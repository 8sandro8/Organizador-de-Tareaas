const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tasks = await prisma.task.findMany({
        include: { subject: true }
    });
    tasks.forEach(t => {
        console.log(`[${t.subject.code}] ${t.type}: ${t.title} (${t.duration || 'no dur'})`);
    });
}

main().finally(() => prisma.$disconnect());
