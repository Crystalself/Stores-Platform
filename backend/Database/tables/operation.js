const knex = require("../config/knex");
const {OPERATION_NAME, OPERATION_STATUS} = require('../../Controllers/utils/enums');

module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.enu('name', Object.values(OPERATION_NAME));
    table.json('data');
    table.enu('status', Object.values(OPERATION_STATUS));
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
}

