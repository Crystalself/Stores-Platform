const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.string('store_name').index();
    table.string('logo');
    table.string('address1');
    table.string('address2');
    table.string('city');
    table.string('country');
    table.float('rating');
    table.integer('rating_count');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
}

