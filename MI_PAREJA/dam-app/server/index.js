const path = require('path');

// --- OVERRIDE CRASH LOGGING PARA SYNOLOGY PM2 ---
process.on('uncaughtException', (err) => {
    require('fs').appendFileSync(path.join(__dirname, 'pm2_crash.log'), `[UNCAUGHT] ${new Date().toISOString()}\n${err.stack}\n\n`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    require('fs').appendFileSync(path.join(__dirname, 'pm2_crash.log'), `[UNHANDLED REJECTION] ${new Date().toISOString()}\n${reason}\n\n`);
});

require('dotenv').config({ path: path.resolve(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3016;

app.use(cors());
app.use(express.json());

// --- ULTRA LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log(`[BODY]:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

const DEFAULT_SUBJECTS = [
    { id: 1, code: "01", name: "LENGUAJES DE MARCAS", icon: "🧱" },
    { id: 2, code: "02", name: "DIGITALIZACION APLICADA", icon: "📱" },
    { id: 3, code: "03", name: "ENTORNOS DE DESARROLLO", icon: "🛠️" },
    { id: 4, code: "04", name: "ITINERARIO PERSONAL", icon: "🧭" },
    { id: 5, code: "05", name: "INGLES", icon: "🇬🇧" },
    { id: 6, code: "06", name: "SISTEMAS INFORMATICOS", icon: "🖥️" },
    { id: 7, code: "07", name: "BASES DE DATOS", icon: "🗄️" },
    { id: 8, code: "08", name: "PROGRAMACION", icon: "☕" }
];

// --- ROUTES ---

// Servir archivos estáticos del frontend React
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/ping', (req, res) => {
    res.json({ status: 'online', version: '6.2 ULTRA', message: 'Kernel is UP' });
});

// GET /api/subjects
app.get('/api/subjects', async (req, res) => {
    try {
        console.log("Fetching subjects from DB...");
        const subjects = await prisma.subject.findMany({
            include: { tasks: true, exams: true }
        });
        console.log(`Found ${subjects.length} subjects in DB.`);
        res.json(subjects);
    } catch (error) {
        console.error("CRITICAL DB ERROR (Subjects):", error.message);
        res.status(500).json({ error: "DB_CONNECTION_FAILED", message: error.message });
    }
});

// POST /api/subjects
app.post('/api/subjects', async (req, res) => {
    const { name, code, icon } = req.body;
    try {
        console.log(`Creating Subject: ${name}`);
        const result = await prisma.subject.create({
            data: { name, code, icon: icon || '📚' }
        });
        res.json(result);
    } catch (error) {
        console.error("ERROR CREATING SUBJECT:", error);
        res.status(500).json({ error: "SUBJECT_CREATION_FAILED" });
    }
});

// PUT /api/subjects/:id
app.put('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, icon } = req.body;
    try {
        console.log(`Updating Subject: ${id}`);
        const result = await prisma.subject.update({
            where: { id: Number(id) },
            data: { name, code, icon }
        });
        res.json(result);
    } catch (error) {
        console.error("ERROR UPDATING SUBJECT:", error);
        res.status(500).json({ error: "SUBJECT_UPDATE_FAILED" });
    }
});

// DELETE /api/subjects/:id
app.delete('/api/subjects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Deleting Subject ID: ${id}`);
        // To delete a Subject, we must first delete its associated tasks due to foreign keys.
        await prisma.task.deleteMany({
            where: { subjectId: Number(id) }
        });
        await prisma.exam.deleteMany({
            where: { subjectId: Number(id) }
        });
        // Delete the root subject
        await prisma.subject.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true, message: "Cascade Subject deletion successful." });
    } catch (error) {
        console.error("ERROR DELETING SUBJECT:", error);
        res.status(500).json({ error: "SUBJECT_DELETION_FAILED", details: error.message });
    }
});

// GET /api/tasks (All tasks)
app.get('/api/tasks', async (req, res) => {
    try {
        console.log("Fetching all tasks...");
        const tasks = await prisma.task.findMany({
            include: { subject: true },
            orderBy: [
                { isCompleted: 'asc' },
                { completedAt: 'desc' },
                { date: 'desc' }
            ]
        });
        res.json(tasks);
    } catch (error) {
        console.error("CRITICAL DB ERROR (Tasks):", error.message);
        res.status(500).json({ error: "DB_CONNECTION_FAILED", message: error.message });
    }
});

// POST /api/tasks
app.post('/api/tasks', async (req, res) => {
    const { title, subjectId, type, date, link, description, duration, resumePoint } = req.body;
    try {
        console.log(`Attempting to create task: ${title} for subject ${subjectId}`);
        const newTask = await prisma.task.create({
            data: {
                title,
                subjectId: Number(subjectId),
                type: type || 'CLASE',
                date: date ? new Date(date) : new Date(),
                link: link || null,
                description: description || null,
                duration: duration || null,
                resumePoint: resumePoint || null
            }
        });
        console.log("Task created successfully:", newTask.id);
        res.json(newTask);
    } catch (error) {
        console.error("ERROR CREATING TASK:", error);
        res.status(500).json({ error: "TASK_CREATION_FAILED", details: error.message });
    }
});

// PUT /api/tasks/:id/toggle
app.put('/api/tasks/:id/toggle', async (req, res) => {
    const { id } = req.params;
    const { completionNote } = req.body;
    try {
        const task = await prisma.task.findUnique({ where: { id: Number(id) } });
        if (!task) return res.status(404).json({ error: "Task not found" });

        const updated = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                isCompleted: !task.isCompleted,
                completionNote: !task.isCompleted ? (completionNote !== undefined ? completionNote : null) : null,
                completedAt: !task.isCompleted ? new Date() : null
            }
        });
        res.json(updated);
    } catch (error) {
        console.error("ERROR TOGGLING TASK:", error);
        res.status(500).json({ error: "TASK_UPDATE_FAILED" });
    }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, link, type, duration, resumePoint, completionNote, completedAt } = req.body;
    try {
        const updated = await prisma.task.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                link,
                type,
                duration,
                resumePoint,
                completionNote,
                completedAt: completedAt ? new Date(completedAt) : undefined
            }
        });
        res.json(updated);
    } catch (error) {
        console.error("ERROR UPDATING TASK:", error);
        res.status(500).json({ error: "TASK_UPDATE_FAILED", details: error.message });
    }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("ERROR DELETING TASK:", error);
        res.status(500).json({ error: "TASK_DELETION_FAILED", details: error.message });
    }
});

// POST /api/tasks/bulk-delete
app.post('/api/tasks/bulk-delete', async (req, res) => {
    const { ids } = req.body;
    try {
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: "INVALID_INPUT", message: "Expected array of IDs" });
        }
        console.log(`Bulk deleting ${ids.length} tasks...`);
        await prisma.task.deleteMany({
            where: {
                id: { in: ids.map(id => Number(id)) }
            }
        });
        res.json({ success: true, message: `${ids.length} tasks deleted successfully` });
    } catch (error) {
        console.error("ERROR BULK DELETING TASKS:", error);
        res.status(500).json({ error: "BULK_DELETION_FAILED", details: error.message });
    }
});

// Catch-all para el router de React SPA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(`🚀 KERNEL v6.2 ULTRA - SISTEMA ACTIVO`);
    console.log(`📡 URL: http://0.0.0.0:${PORT}`);
    console.log(`📂 DB: SQLite + Prisma`);
    console.log(`⏰ INICIO: ${new Date().toLocaleString()}`);
    console.log(`=================================================`);
});
