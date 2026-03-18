try {
    const dotenv = require('dotenv');
    console.log('Dotenv loaded successfully');
    dotenv.config();
    console.log('Dotenv configured successfully');
} catch (err) {
    console.error('Error loading dotenv:', err.message);
    console.error('Current __dirname:', __dirname);
    console.error('Current cwd:', process.cwd());
}
