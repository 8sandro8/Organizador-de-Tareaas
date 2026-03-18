const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const BASE_DIR = path.join(__dirname, '..', '..', '..');
const DASHBOARD_FILE = path.join(BASE_DIR, 'DAM-Dashboard.md');

async function main() {
    console.log("🔍 Starting FINAL ROBUST MD to Prisma Sync...");

    if (!fs.existsSync(DASHBOARD_FILE)) {
        console.error("❌ Dashboard not found at:", DASHBOARD_FILE);
        return;
    }

    const content = fs.readFileSync(DASHBOARD_FILE, 'utf-8');

    // 1. Map codes to files
    const subjectRegex = /##\s+(\d+\s+.*?)\s+—\s+\[.+?\]\(\.\/(.+?\.md)\)/g;
    let match;
    const subjectFiles = [];

    while ((match = subjectRegex.exec(content)) !== null) {
        subjectFiles.push({
            code: match[1].split(' ')[0],
            fileName: match[2]
        });
    }

    // 2. Parse Dashboard content directly
    console.log("\n📊 Parsing Dashboard content...");
    await parseAndSyncDashboardContent(content);

    // 3. Parse sub-files
    for (const sf of subjectFiles) {
        const subjectPath = path.join(BASE_DIR, sf.fileName);
        if (!fs.existsSync(subjectPath)) continue;

        console.log(`\n📚 Processing sub-file: ${sf.fileName} (${sf.code})...`);
        const subject = await prisma.subject.findUnique({ where: { code: sf.code } });
        if (!subject) continue;

        const subjContent = fs.readFileSync(subjectPath, 'utf-8');
        const tasks = parseFlexibleTasks(subjContent);
        await syncTasksToDB(subject.id, tasks);
    }

    console.log("\n✨ Sync finished!");
}

async function parseAndSyncDashboardContent(content) {
    const lines = content.split('\n');
    let currentSubjectCode = null;
    let inSubjectSection = false;

    for (let line of lines) {
        const subjMatch = line.match(/^##\s+(\d+)\s+/);
        if (subjMatch) {
            currentSubjectCode = subjMatch[1];
            inSubjectSection = true;
            continue;
        }

        if (line.startsWith('## ') && !line.includes(' — ')) {
            inSubjectSection = false;
        }

        if (inSubjectSection && currentSubjectCode) {
            const task = parseSingleTaskLine(line);
            if (task) {
                const subject = await prisma.subject.findUnique({ where: { code: currentSubjectCode } });
                if (subject) {
                    await syncTasksToDB(subject.id, [task]);
                }
            }
        }
    }
}

function parseFlexibleTasks(content) {
    const lines = content.split('\n');
    let currentType = 'CLASE';
    const results = [];

    for (let line of lines) {
        const l = line.toLowerCase();
        if (l.includes('## clases pendientes')) currentType = 'CLASE';
        else if (l.includes('## ejercicios')) currentType = 'EJERCICIO';
        else if (l.includes('## hecho')) currentType = 'DONE';
        else if (line.startsWith('## ')) currentType = '';

        if (currentType && currentType !== 'DONE') {
            const task = parseSingleTaskLine(line);
            if (task) {
                task.type = currentType;
                results.push(task);
            }
        }
    }
    return results;
}

function parseSingleTaskLine(line) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) return null;
    if (trimmed.includes('_Sin elementos')) return null;

    let title = trimmed.replace(/^-\s*\[\s*\]\s*/, '').replace(/^-\s*/, '').trim();
    if (!title || title === '[ ]') return null;

    let duration = null;
    let link = null;

    // Detect duration: 1:26h, (45 min), 2h 30m
    const durMatch = title.match(/(\d+(?::\d+)?[hH])|(\d+\s*min(?:uto)?s?)/i);
    if (durMatch) {
        duration = durMatch[0];
    }
    // Also check for duration in parentheses
    const durInParen = title.match(/\(([^)]*(?:min|h|duraci)[^)]*)\)/i);
    if (durInParen && !duration) {
        duration = durInParen[1];
    }

    // Detect link
    let linkMatch = title.match(/\[(?:enlace|ver)\]\(([^)]+)\)/i);
    if (!linkMatch) {
        linkMatch = title.match(/\((https?:\/\/[^)]+)\)/i);
    }

    if (linkMatch) {
        link = linkMatch[1];
        title = title.replace(/\s*-\s*\[(?:enlace|ver)\]\([^)]+\)/i, '')
            .replace(/\s*\(\s*\[(?:enlace|ver)\]\([^)]+\)\s*\)/i, '')
            .replace(/\s*\(https?:\/\/[^)]+\)/i, '')
            .trim();
    }

    return { title, duration, link, type: 'CLASE' };
}

async function syncTasksToDB(subjectId, tasks) {
    for (const task of tasks) {
        if (!task.title || task.title.length < 3) continue;

        const existing = await prisma.task.findFirst({
            where: { title: task.title, subjectId: subjectId }
        });

        if (!existing) {
            await prisma.task.create({
                data: {
                    title: task.title,
                    type: task.type || 'CLASE',
                    duration: task.duration || null,
                    link: task.link || null,
                    isCompleted: false,
                    subjectId: subjectId,
                    description: 'Recuperado automáticamente'
                }
            });
            console.log(`  ✅ Recovered: ${task.title}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
