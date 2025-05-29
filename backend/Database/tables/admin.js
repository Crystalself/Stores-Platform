const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.string('username');
    table.string('password');
    table.boolean('restricted');
    table.integer('level');
    table.integer('limit_sessions').defaultTo(3);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
}

