module.exports = (message) => {
    switch (message) {
        case "VALIDATION_ERROR":
            return {status: 422, message};
        case "USERNAME_PASSWORD_INCORRECT":
            return {status: 400, message: 'Please check your credentials!'};
        case "UNAUTHORIZED":
            return {status: 401, message};
        default:
            return {status: 500, message: "INTERNAL_SERVER_ERROR"};
    }
}
