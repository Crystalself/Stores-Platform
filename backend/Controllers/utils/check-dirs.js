const {join} = require('path');
const fs = require("fs");
const paths = {
    dump: join(__dirname, "..", "..", "dump"),
    uploads:join(__dirname ,"..","..","uploads"),
    profile:join(__dirname ,"..","..","uploads","profile"),
}

module.exports = () => {
    for (const [key, value] of Object.entries(paths)) {
        if (!fs.existsSync(value)) {
            fs.mkdirSync(value)
            console.log(`[${key}] Directory is missing and I will create it for you :)`)
        }
    }
};