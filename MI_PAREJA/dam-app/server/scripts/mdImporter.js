const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Target directory is PENDIENTE (two levels up from dam-app/server)
const PENDING_DIR = path.resolve(process.cwd(), '../..');

async function parseMDFile(filePath) {
    try {
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) return null;

        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath, '.md');
        console.log(`🔍 Parsing file: ${fileName}`);

        const subjectCodeMatch = fileName.match(/^(\d+)/);
        const subjectCode = subjectCodeMatch ? subjectCodeMatch[1] : null;

        if (!subjectCode) {
            return null;
        }

        const subject = await prisma.subject.findUnique({ where: { code: subjectCode } });
        if (!subject) {
            console.warn(`   ⚠️ Subject code ${subjectCode} not found in DB`);
            return null;
        }

        const tasks = [];
        const lines = content.split(/\r?\n/);
        let currentSection = '';

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').toUpperCase();
                continue;
            }

            // Uncompleted tasks
            if (line.startsWith('- [ ]')) {
                const titleMatch = line.match(/- \[ \] (.*?)(\s*\(\[ver\]\((.*?)\)\))?$/);
                if (titleMatch) {
                    tasks.push({
                        title: titleMatch[1].trim(),
                        link: titleMatch[3] || null,
                        isCompleted: false,
                        type: currentSection.includes('EJERCICIO') ? 'EJERCICIO' : 'CLASE',
                        subjectId: subject.id,
                        date: new Date()
                    });
                }
            }

            // Completed tasks
            const completedMatch = line.match(/^- (\d{4}-\d{2}-\d{2})\s+[—–-]\s*(.*?)(\s*-\s*\[enlace\]\((.*?)\))?$/);
            if (completedMatch) {
                const dateStr = completedMatch[1];
                const rawTitle = completedMatch[2];
                const link = completedMatch[4] || null;

                const durationMatch = rawTitle.match(/(\d+:\d+h|\d+\s*min)/i);
                const resumeMatch = rawTitle.match(/minuto\s*(\d+:\d+|\d+)/i);

                tasks.push({
                    title: rawTitle.trim(),
                    link: link,
                    isCompleted: true,
                    type: 'CLASE',
                    subjectId: subject.id,
                    date: new Date(dateStr),
                    duration: durationMatch ? durationMatch[1] : null,
                    resumePoint: resumeMatch ? resumeMatch[1] : null
                });
            }
        }

        console.log(`   📊 Found ${tasks.length} tasks`);
        return tasks;
    } catch (err) {
        console.error(`   ❌ Error reading ${filePath}:`, err.message);
        return null;
    }
}

async function main() {
    console.log(`🚀 Starting MD Import Process...`);

    // Force DELETE mode for network share stability
    try {
        await prisma.$executeRawUnsafe('PRAGMA journal_mode=DELETE;');
        console.log('🔧 SQLite: Mode set to DELETE for network stability');
    } catch (e) {
        console.warn('⚠️ Could not set journal mode:', e.message);
    }

    console.log(`📂 Target Directory: ${PENDING_DIR}`);

    if (!fs.existsSync(PENDING_DIR)) {
        console.error(`❌ Directory not found: ${PENDING_DIR}`);
        return;
    }

    // Filter for files starting with digits and ending in .md, ensuring they aren't directories
    const items = fs.readdirSync(PENDING_DIR);
    const files = items.filter(f => {
        const fullPath = path.join(PENDING_DIR, f);
        return f.endsWith('.md') && /^\d+/.test(f) && fs.statSync(fullPath).isFile();
    });

    console.log(`📂 Files found: ${files.join(', ')}`);

    let totalImported = 0;

    for (const file of files) {
        const filePath = path.join(PENDING_DIR, file);
        const tasks = await parseMDFile(filePath);

        if (tasks && tasks.length > 0) {
            // Fetch all existing tasks for this subject once to avoid repeated findFirst calls
            // This is much safer on network shares
            const subjectId = tasks[0].subjectId;
            let existingTasks = [];
            try {
                existingTasks = await prisma.task.findMany({
                    where: { subjectId: subjectId },
                    select: { title: true }
                });
            } catch (err) {
                console.error(`   ⚠️ Error fetching existing tasks for subject ${subjectId}:`, err.message);
                continue;
            }

            const existingTitles = new Set(existingTasks.map(t => t.title));

            for (const task of tasks) {
                if (task && !existingTitles.has(task.title)) {
                    try {
                        console.log(`   + Adding: ${task.title.substring(0, 40)}...`);
                        await prisma.task.create({ data: task });
                        totalImported++;
                        // Add to set to prevent duplicates within the same file run
                        existingTitles.add(task.title);
                    } catch (taskErr) {
                        console.error(`   ❌ Error processing task "${task.title}":`, taskErr.message);
                        if (taskErr.message.includes('malformed')) {
                            console.warn('   🛑 Detected DB Malformed error. Network share might be unstable.');
                        }
                    }
                }
            }
        }
    }

    console.log(`\n✅ Import finished. Total new tasks imported: ${totalImported}`);
}

main()
    .catch(e => {
        console.error("❌ Fatal Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
