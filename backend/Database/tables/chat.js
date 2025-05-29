const knex = require("../config/knex");
const {OPERATION_NAME, OPERATION_STATUS} = require('../../Controllers/utils/enums');

module.exports = (table) => {
    table.increments('id').primary();
    table.integer('first').unsigned();
    table.integer('second').unsigned();
    table.json('data');// change for actual columns when we determine what chat data are
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('first').references('user.id');
    table.foreign('second').references('user.id');
}

