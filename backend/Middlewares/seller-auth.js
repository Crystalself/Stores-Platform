const handleError = require("../Controllers/utils/handle-error");
const {ERRORS} = require("../Controllers/utils/enums");

/**
 * Middleware to verify if the authenticated user is a seller (store or merchant)
 * Must be used after the user-auth middleware
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
module.exports = async (req, res, next) => {
    try {
        if (req.user.type !== "store" && req.user.type !== "merchant") {
            throw new Error(ERRORS.UNAUTHORIZED);
        }
        next();
    } catch (e) {
        res.clearCookie("Authorization");
        res.removeHeader("authorization");
        const {status, message} = handleError(e.message);
        if (status === 500) console.error(e);
        res.status(status).send({
            message: message,
            statusCode: status
        });
    }
};
