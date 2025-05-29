const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('operation_id').unsigned();
    table.string('otp');
    table.integer('tries').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('operation_id').references('operation.id').onDelete('CASCADE');
}

