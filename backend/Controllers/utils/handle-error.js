const {ERROR_MESSAGES} = require('./enums');
module.exports = (message) => {
    const error = ERROR_MESSAGES[message];
    if (error) return error;
    return {status: 500, message: "INTERNAL_SERVER_ERROR"};
}
