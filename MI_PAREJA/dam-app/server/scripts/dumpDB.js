const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tasks = await prisma.task.findMany({
        include: { subject: true }
    });
    console.log(JSON.stringify(tasks, null, 2));
}

main().finally(() => prisma.$disconnect());
