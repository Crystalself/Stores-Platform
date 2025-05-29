const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable();
    table.integer('product_id').unsigned().nullable();
    table.integer('rating').notNullable();
    table.string('message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
    table.foreign('product_id').references('product.id').onDelete('CASCADE');
}

