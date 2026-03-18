const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create Subjects
    const subjects = [
        { code: "01", name: "LENGUAJES DE MARCAS", icon: "🧱" },
        { code: "02", name: "DIGITALIZACION APLICADA", icon: "📱" },
        { code: "03", name: "ENTORNOS DE DESARROLLO", icon: "🛠️" },
        { code: "04", name: "ITINERARIO PERSONAL", icon: "🧭" },
        { code: "05", name: "INGLES", icon: "🇬🇧" },
        { code: "06", name: "SISTEMAS INFORMATICOS", icon: "🖥️" },
        { code: "07", name: "BASES DE DATOS", icon: "🗄️" },
        { code: "08", name: "PROGRAMACION", icon: "☕" }
    ];

    for (const s of subjects) {
        await prisma.subject.upsert({
            where: { code: s.code },
            update: {},
            create: s
        });
    }

    // Create a sample task
    const prog = await prisma.subject.findUnique({ where: { code: "08" } });
    if (prog) {
        await prisma.task.create({
            data: {
                title: "Revisar punteros en Java (Fake Task)",
                subjectId: prog.id,
                type: "CLASE",
                isCompleted: false
            }
        });
    }

    console.log("✅ Seed complete");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
