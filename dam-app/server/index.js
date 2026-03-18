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

const getPrismaForUser = (userEnv) => {
    const basePath = userEnv === 'MI_PAREJA' 
        ? path.resolve(__dirname, '../../MI_PAREJA/dam-app/server')
        : __dirname;
    const dbPath = path.join(basePath, 'prisma/dev.db').replace(/\\/g, '/');
    
    console.log(`[DB_SWITCH] User: ${userEnv}, DB Path: ${dbPath}`);
    
    const client = new PrismaClient({
        datasources: {
            db: {
                url: `file:${dbPath}`
            }
        }
    });
    
    return client;
};

let currentPrisma = getPrismaForUser('SANDRO');
let currentUserEnv = 'SANDRO';

// Initialize connection
currentPrisma.$connect()
    .then(() => console.log('[INIT] Connected to SANDRO DB'))
    .catch(e => console.error('[INIT] Error:', e.message));

const switchDatabase = async (userEnv) => {
    if (userEnv === currentUserEnv) {
        return { success: true, user: currentUserEnv, message: 'Mismo entorno' };
    }
    
    try {
        console.log(`[DB_SWITCH] Attempting to switch from ${currentUserEnv} to ${userEnv}`);
        
        // Create new Prisma client first
        currentPrisma = getPrismaForUser(userEnv);
        
        // Test connection
        await currentPrisma.$connect();
        console.log(`[DB_SWITCH] Connected to: ${userEnv}`);
        
        // Disconnect old
        try {
            await currentPrisma.$disconnect();
        } catch(e) {
            // Ignore disconnect errors
        }
        
        currentUserEnv = userEnv;
        
        return { success: true, user: currentUserEnv, message: `Cambiando al entorno de ${userEnv === 'MI_PAREJA' ? 'LILA' : 'SANDRO'}` };
    } catch (error) {
        console.error('[DB_SWITCH] Error:', error.message);
        return { success: false, user: currentUserEnv, message: 'Error al cambiar de entorno: ' + error.message };
    }
};

const PORT = process.env.PORT || 3015;

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE: Auto-switch database based on user header ---
app.use(async (req, res, next) => {
    try {
        const userEnv = req.headers['x-user-environment'] || 'SANDRO';
        
        console.log(`[MIDDLEWARE] Request: ${req.url}, Header user: ${userEnv}, Current: ${currentUserEnv}`);
        
        if (userEnv !== currentUserEnv) {
            console.log(`[MIDDLEWARE] Switching DB from ${currentUserEnv} to ${userEnv}`);
            await switchDatabase(userEnv);
        }
        
        req.prisma = currentPrisma;
        req.currentUser = currentUserEnv;
        console.log(`[MIDDLEWARE] Using DB for: ${currentUserEnv}`);
        next();
    } catch (error) {
        console.error('[MIDDLEWARE] Error:', error.message);
        req.prisma = currentPrisma;
        req.currentUser = currentUserEnv;
        next();
    }
});

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

// API routes FIRST
app.get('/api/ping', (req, res) => {
    res.json({ status: 'online', version: '6.2 ULTRA', message: 'Kernel is UP', user: req.currentUser });
});

// Endpoint para cambiar de entorno
app.post('/api/switch-user', async (req, res) => {
    const { user } = req.body;
    
    if (!user || typeof user !== 'string') {
        return res.status(400).json({ success: false, message: 'Usuario requerido' });
    }
    
    console.log('[SWITCH_REQUEST] Received request to switch to:', user);
    if (user !== 'SANDRO' && user !== 'MI_PAREJA') {
        console.log('[SWITCH_REQUEST] Invalid user:', user);
        return res.status(400).json({ success: false, message: 'Usuario inválido' });
    }
    
    console.log('[SWITCH_REQUEST] Calling switchDatabase...');
    const result = await switchDatabase(user);
    console.log('[SWITCH_REQUEST] Result:', result);
    res.json(result);
});

// GET /api/current-user
app.get('/api/current-user', (req, res) => {
    res.json({ user: currentUserEnv });
});

// GET /api/subjects
app.get('/api/subjects', async (req, res) => {
    try {
        console.log("Fetching subjects from DB...");
        const subjects = await req.prisma.subject.findMany({
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
    
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El nombre es obligatorio" });
    }
    if (!code || !code.trim()) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El código es obligatorio" });
    }
    
    try {
        console.log(`Creating Subject: ${name}`);
        const result = await req.prisma.subject.create({
            data: { name: name.trim(), code: code.trim(), icon: icon || '📚' }
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
    
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El nombre es obligatorio" });
    }
    if (!code || !code.trim()) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El código es obligatorio" });
    }
    
    try {
        console.log(`Updating Subject: ${id}`);
        const result = await req.prisma.subject.update({
            where: { id: Number(id) },
            data: { name: name.trim(), code: code.trim(), icon }
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
        await req.prisma.task.deleteMany({
            where: { subjectId: Number(id) }
        });
        await req.prisma.exam.deleteMany({
            where: { subjectId: Number(id) }
        });
        // Delete the root subject
        await req.prisma.subject.delete({
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
        const tasks = await req.prisma.task.findMany({
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
    
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El título es obligatorio" });
    }
    if (!subjectId) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El ID de asignatura es obligatorio" });
    }
    
    try {
        console.log(`Attempting to create task: ${title} for subject ${subjectId}`);
        const newTask = await req.prisma.task.create({
            data: {
                title: title.trim(),
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
        const task = await req.prisma.task.findUnique({ where: { id: Number(id) } });
        if (!task) return res.status(404).json({ error: "Task not found" });

        const updated = await req.prisma.task.update({
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
    
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "VALIDATION_ERROR", message: "El título es obligatorio" });
    }
    
    try {
        const updated = await req.prisma.task.update({
            where: { id: Number(id) },
            data: {
                title: title.trim(),
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
        await req.prisma.task.delete({
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
        await req.prisma.task.deleteMany({
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

// Servir archivos estáticos del frontend React
app.use(express.static(path.join(__dirname, '../client/dist')));

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
