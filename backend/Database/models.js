const knex = require("./config/knex");
const tables = require("./tables")
const Models = {};

for (const key of Object.keys(tables)) {
    Models[key.charAt(0).toUpperCase() + key.substring(1)] = () => knex(key);
}
module.exports = {...Models , knex};