const tables = require("../tables");
const triggers = require("../triggers");
const knex = require("./knex");

const createTables = async () => {
    try {
        for (const [name, callback] of Object.entries(tables)) {
            const hasTable = await knex.schema.hasTable(name);
            if (!hasTable) await knex.schema.createTable(name, callback);
        }
    } catch (e) {
        console.error(e);
    }
};


const dropTables = async () => {
    try {
        for (const name of Object.keys(tables)) {
            const hasTable = await knex.schema.hasTable(name);
            if (hasTable) await knex.raw(`DROP TABLE IF EXISTS \"${name}\" CASCADE`);
        }
    } catch (e) {
        console.error(e);
    }
};

const checkTriggerExists = async (knex, triggerName) => {
    const result = await knex.raw(
        `
      SELECT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = ?
      ) as "exists"
      `,
        [triggerName]
    );
    return result.rows[0].exists;
};

const setupDatabase = async ({ force }) => {
    if (force) await dropTables();
    await createTables();
    for (const trigger of Object.values(triggers)) {
        const exists = await checkTriggerExists(knex, trigger.name);
        if (!exists) {
            await trigger.up(knex);
            console.log(`Trigger ${trigger.name} created.`);
        } else {
            console.log(`Trigger ${trigger.name} already exists.`);
        }
    }
    console.log("Database setup completed");
};

module.exports = setupDatabase;
