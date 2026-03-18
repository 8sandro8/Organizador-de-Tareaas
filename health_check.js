const http = require('http');

const SERVICES = [
    { name: 'Sandro Kernel', port: 3015, path: '/api/ping' },
    { name: 'Sandro Frontend', port: 5173, path: '/' },
    { name: 'Pareja Kernel', port: 3016, path: '/api/ping' },
    { name: 'Pareja Frontend', port: 5174, path: '/' }
];

const HOST = '100.72.183.18';

console.log(`--- DAM Organizer Health Check (${HOST}) ---`);

async function checkService(service) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: service.port,
            path: service.path,
            method: 'GET',
            timeout: 2000
        };

        const req = http.request(options, (res) => {
            console.log(`✅ [${service.name}] Status: ${res.statusCode}`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`❌ [${service.name}] Offline - Error: ${err.code}`);
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`❌ [${service.name}] Offline - Timeout`);
            resolve(false);
        });

        req.end();
    });
}

async function runAll() {
    for (const service of SERVICES) {
        await checkService(service);
    }
}

runAll();
