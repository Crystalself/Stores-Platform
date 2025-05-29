const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('chat_id').unsigned();
    table.integer('sender').unsigned();
    table.boolean('received');
    table.boolean('read');
    table.string('message');
    table.string('attachment');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('sender').references('user.id');
    table.foreign('chat_id').references('chat.id').onDelete('CASCADE');
}

