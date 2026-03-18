const path = require('path');
const serverDir = __dirname;
const nodeModules = path.join(serverDir, 'node_modules');

// Manual resolution hack
function localRequire(name) {
    return require(path.join(nodeModules, name));
}

const express = localRequire('express');
const cors = localRequire('cors');
const { PrismaClient } = localRequire('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3015;

app.use(cors());
app.use(express.json());

app.get('/api/subjects', async (req, res) => {
    console.log('GET /api/subjects called');
    try {
        const subjects = await prisma.subject.findMany({ include: { tasks: true } });
        console.log(`Found ${subjects.length} subjects`);
        res.json(subjects);
    } catch (err) {
        console.error('Error in /api/subjects:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Diagnostic Server running on http://0.0.0.0:${PORT}`);
});
