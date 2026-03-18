const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'vite_debug_log.txt');
fs.writeFileSync(logPath, `--- VITE STARTUP LOG [${new Date().toISOString()}] ---\n`);

const logStream = fs.createWriteStream(logPath, { flags: 'a' });

// Spawn npm inside the shell to ensure correct environment
const child = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '5173'], {
    shell: true,
    stdio: 'pipe'
});

child.stdout.on('data', (data) => {
    logStream.write(`[OUT] ${data.toString()}`);
});

child.stderr.on('data', (data) => {
    logStream.write(`[ERR] ${data.toString()}`);
});

child.on('close', (code) => {
    logStream.write(`\n[EXIT] Process exited with code ${code}\n`);
});

child.on('error', (err) => {
    logStream.write(`[CRITICAL ERROR] Failed to start subprocess: ${err.message}\n`);
});
