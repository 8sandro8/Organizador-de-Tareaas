const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const subjects = await prisma.subject.findMany();
        console.log('--- SUBJECTS IN DATABASE ---');
        console.log(JSON.stringify(subjects, null, 2));
        console.log('--- TOTAL SUBJECTS:', subjects.length);
    } catch (error) {
        console.error('Error reading database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
