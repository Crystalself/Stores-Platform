const knex = require("../config/knex");
const {CATEGORY} = require('../../Controllers/utils/enums');

module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.string('name');
    table.string('description');
    table.string('thumbnail_image');
    table.json('images');
    table.enu('category', Object.values(CATEGORY));
    table.float('price');
    table.float('discount').defaultTo(0);
    table.integer('sell_count');
    table.float('rating');
    table.integer('rating_count');
    table.boolean('in_stock').defaultTo(true);
    table.boolean('unlisted').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id').onDelete('CASCADE');
}

