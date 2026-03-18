const fs = require('fs');
const path = require('path');

const DB_PATH = "C:/Users/Sandro/.dam-app/dev.db";
const BACKUP_DIR = path.join(__dirname, '../../backups');

function createBackup() {
    if (!fs.existsSync(DB_PATH)) {
        console.error('❌ Database file not found at:', DB_PATH);
        return;
    }

    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log('📂 Created backups directory.');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFileName = `dev-backup-${timestamp}.db`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);

    try {
        fs.copyFileSync(DB_PATH, backupPath);
        console.log(`✅ Backup created successfully: ${backupFileName}`);

        // Optional: Keep only last 10 backups
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('dev-backup-'))
            .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
            .sort((a, b) => b.time - a.time);

        if (files.length > 10) {
            files.slice(10).forEach(f => {
                fs.unlinkSync(path.join(BACKUP_DIR, f.name));
                console.log(`🗑️ Deleted old backup: ${f.name}`);
            });
        }
    } catch (err) {
        console.error('❌ Error creating backup:', err.message);
    }
}

createBackup();
