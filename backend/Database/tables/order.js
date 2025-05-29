const knex = require("../config/knex");
const {ORDER_STATUS} = require('../../Controllers/utils/enums');

module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.json('products');
    table.float('total');
    table.string('message');
    table.boolean('paid');
    table.boolean('delivery');
    table.enu('status', Object.values(ORDER_STATUS));
    table.string('address');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
}

