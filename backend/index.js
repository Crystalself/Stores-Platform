require('dotenv').config();
const app = require('./app');
const HOSTNAME = app.get('HOSTNAME');
const PORT = app.get('PORT');

// --force . --buildDataBase . --rebuildDataBase . --updateTables
(async () => {
    if(process.argv[2] === '--rebuildDataBase') {
        const {createDatabase, dropDatabase} = require("./Database/config/build-database");
        await dropDatabase();
        await createDatabase();
    }
    if(process.argv[2] === '--buildDataBase') {
        const {createDatabase} = require("./Database/config/build-database");
        await createDatabase();
    }
    if(process.argv[2] === '--updateTables') await require("./Database/config/update-tables")();
})()


require('./Database/config/setup')({force: process.argv[2] === '--force'});

let server,message;
if (process.env.NODE_ENV === "development") {
    server = require("http").createServer(app);
    message = `Server is up on HOST: ${HOSTNAME} PORT: ${PORT}`
}

server.listen(PORT, () => {
    console.log(message);
});