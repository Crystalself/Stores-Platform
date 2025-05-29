if (require.main === module) {
    require('dotenv').config();
}

const {createDatabase, dropDatabase} = require("./Database/config/build-database");
const {exportToPostman} = require('./Controllers/utils/postman-exporter');
const {exportToSwagger} = require('./Controllers/utils/swagger-exporter');
const flagsHandler = (async () => {
    if(process.argv.includes('--update-tables')) {
        await require("./Database/config/update-tables")();
    }else if(process.argv.includes("--force-tables")){
        await require('./Database/config/setup')({force:true});
    }else if(process.argv.includes('--build-database')) {
        await createDatabase();
    }else if(process.argv.includes('--rebuild-database')) {
        await dropDatabase();
        await createDatabase();
    }
    if(!process.argv.includes("--force-tables")) await require('./Database/config/setup')({force:false});

    if(process.argv.includes("--export-postman")) {
        exportToPostman(null, 'dump');
    }
    if(process.argv.includes("--export-swagger")) {
        exportToSwagger(null, 'swagger-docs.json');
    }
    if (require.main === module) {
        process.exit();
    }
})
module.exports = flagsHandler;

if (require.main === module) {
    flagsHandler();

}
