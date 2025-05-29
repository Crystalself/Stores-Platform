const knex = require("../config/knex");
module.exports = (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password');
    table.string('phone');
    table.string('first_name');
    table.string('last_name');
    table.boolean('restricted').defaultTo(false);
    table.boolean('verified').defaultTo(false);
    table.string('bank_name');
    table.string('bank_account');
    table.float('balance').defaultTo(0);
    table.string('profile_pic');
    table.string('type'); // make it enu later
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
}

