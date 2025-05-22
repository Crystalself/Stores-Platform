const knexOpts = require('./knex-opts')
const knexForMaintenance = require('knex')({
    client: 'pg',
    connection: {
        host: knexOpts[process.env.NODE_ENV || 'development'].connection.host,
        user: knexOpts[process.env.NODE_ENV || 'development'].connection.user,
        password: knexOpts[process.env.NODE_ENV || 'development'].connection.password,
        database: 'postgres',
    },
});

const dropDatabase = async () => {
    try {
        await knexForMaintenance.raw(`DROP DATABASE IF EXISTS "${process.env.DB_NAME}"`);
        console.log(`Database '${process.env.DB_NAME}' dropped successfully.`);
    } catch (error) {
        console.error('Error dropping database:', error.message);
    }
};

const createDatabase = async () => {
    try {
        const result = await knexForMaintenance.raw(`
            SELECT 1
            FROM pg_database
            WHERE datname = '${process.env.DB_NAME}'
        `);

        if (result.rows.length > 0) {
            console.log(`Database '${process.env.DB_NAME}' exists.`);
        } else {
            // Create the new database if it doesn't exist
            await knexForMaintenance.raw(`
                CREATE DATABASE "${process.env.DB_NAME}"
                WITH ENCODING 'UTF8'
                LC_COLLATE 'en_US.UTF-8'
                LC_CTYPE 'en_US.UTF-8'
                TEMPLATE template0;
            `);
            console.log(`Database '${process.env.DB_NAME}' created successfully.`);
        }
    } catch (error) {
        console.error('Error creating database:', error.message);
    } finally {
        await knexForMaintenance.destroy(); // Close the maintenance connection
    }
};

module.exports = {createDatabase, dropDatabase}
