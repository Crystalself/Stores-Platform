

const knex = require("../config/knex");
const {SUPPORT_TICKET_STATUS} = require('../../Controllers/utils/enums');
module.exports = (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.integer('admin_id').unsigned();
    table.string('topic');
    table.string('description');
    table.string('upgrade_message');
    table.enu('status', Object.values(SUPPORT_TICKET_STATUS));
    table.integer('rating');
    table.string('review');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('user.id');
    table.foreign('admin_id').references('admin.id');
}

