const {object, string} = require("yup");
const User = require("../../../../Classes/User");
const {ERRORS} = require("../../../utils/enums")
const schema = object({
    email: string().email().min(3).max(50).required(),
    password: string().min(8).max(50).required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {email, password} = req['body'];
        const ip = req.headers["x-real-ip"] || req.headers ["x-forwarded-for"] || req.connection.remoteAddress;
        const {data, Authorization} = await User.login(email, password, ip);
        res.cookie("Authorization", Authorization, {maxAge: 31104000000});
        res.status(200).send({
            statusCode: 200,
            data,
            Authorization,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}