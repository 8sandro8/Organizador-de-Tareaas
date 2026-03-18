const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database - ADMINISTRACIÓN SANITARIA...");

    const subjects = [
        { code: "01", name: "ADMINISTRACIÓN DE SERVICIOS SANITARIOS", icon: "🏥" },
        { code: "02", name: "ESTRUCTURA DE LOS SISTEMAS SANITARIOS", icon: "🏗️" },
        { code: "03", name: "DOCUMENTACIÓN SANITARIA", icon: "📋" },
        { code: "04", name: "MÉTODOS DE CONTENCIÓN FARMACOLÓGICA", icon: "💊" },
        { code: "05", name: "INGLÉS", icon: "🇬🇧" },
        { code: "06", name: "ORGANIZACIÓN DEL ÁREA DE QUIRÓFANO", icon: "⚕️" }
    ];

    for (const s of subjects) {
        await prisma.subject.upsert({
            where: { code: s.code },
            update: {},
            create: s
        });
    }

    await prisma.task.deleteMany({});

    console.log("✅ Seed complete - ASIGNATURAS ADMINISTRACIÓN SANITARIA");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
