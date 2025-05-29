const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.float('credit').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
}

