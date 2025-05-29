require('dotenv').config();
const app = require('./app');
const HOSTNAME = app.get('HOSTNAME');
const PORT = app.get('PORT');

require("./Controllers/utils/check-dirs")();
require("./flags")();

const server = require("http").createServer(app);

server.listen(PORT, () => {
    console.log(`Server is up on HOST: ${HOSTNAME} PORT: ${PORT}`);
    if (process.env.NODE_ENV === "development") console.log(`Swagger UI at http://${process.env.HOSTNAME}:${process.env.PORT}/api-docs`);
});

