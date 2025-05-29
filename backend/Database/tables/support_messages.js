const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.integer('admin_id').unsigned();
    table.integer('support_ticket_id').unsigned();
    table.string('message');
    table.string('attachment');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id');
    table.foreign('admin_id').references('admin.id');
    table.foreign('support_ticket_id').references('support_ticket.id');
}