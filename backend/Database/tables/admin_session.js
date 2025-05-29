const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('admin_id').unsigned();
    table.string('ip');
    table.jsonb('info');
    table.boolean('trusted');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('admin_id').references('admin.id').onDelete('CASCADE');
}

