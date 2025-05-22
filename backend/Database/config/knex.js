const knex = require('knex');
const knexOpts = require('./knex-opts');

const environment = process.env.NODE_ENV || 'development';
const config = knexOpts[environment];
let db;

try {
    db = knex(config);
    console.log('Database connection established successfully.');
} catch (error) {
    console.error('Failed to establish database connection:', error.message);
    process.exit(1);
}

module.exports = db