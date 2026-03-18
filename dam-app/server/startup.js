const path = require('path');
const moduleAlias = require('module');

// Force include the local node_modules in the resolution path
const nodeModulesPath = path.join(__dirname, 'node_modules');
process.env.NODE_PATH = nodeModulesPath + (process.env.NODE_PATH ? path.delimiter + process.env.NODE_PATH : '');
require('module')._initPaths();

console.log('🚀 Custom Startup: Forcing node_modules path:', nodeModulesPath);

// Manually require index.js
require('./index.js');
