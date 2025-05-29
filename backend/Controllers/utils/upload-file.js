const { join } = require("path");
const { promisify } = require("util");
const URL = process.env.URL;

const uploadFiles = async (filesObj, specificFolder) => {
    let filesToUpdate = {};
    for (const [key , value] of Object.entries(filesObj)) {
        const fileName = Date.now() + (value.name).replaceAll(' ', '');
        const moveFunction = promisify(value.mv);

        // Create absolute path to uploads directory
        const uploadPath = join(__dirname, "..", "..", "uploads", specificFolder, fileName);

        // Ensure the directory exists
        const uploadDir = join(__dirname, "..", "..", "uploads", specificFolder);
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await moveFunction(uploadPath);
        filesToUpdate[key] = `${URL}/${specificFolder}/${fileName}`;
    }
    return filesToUpdate;
};

const uploadFilesArray = async (filesArray, specificFolder) => {
    try {
        const files = filesArray;
        let filesToUpdate = [];

        // Ensure the directory exists
        const uploadDir = join(__dirname, "..", "..", "uploads", specificFolder);
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (let file of files) {
            const fileName = Date.now() + file.name;
            const moveFunction = promisify(file.mv);

            // Create absolute path to file
            const uploadPath = join(__dirname, "..", "..", "uploads", specificFolder, fileName);

            await moveFunction(uploadPath);
            filesToUpdate.push(`${URL}/${specificFolder}/${fileName}`);
        }
        return filesToUpdate;
    } catch (error) {
        console.error(error);
        return [];
    }
};
module.exports = { uploadFiles, uploadFilesArray };
