const {object, string} = require('yup');
const {ERRORS, OPERATION_STATUS, OPERATION_NAME} = require("../../../utils/enums");
const User = require("../../../../Classes/User");
const schema = object({
    email: string().email().max(255).required(),
    otp: string().length(4).required(),
    password: string().min(8).max(100).required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {email, otp , password} = req.body;
        const user = await User.getUserByEmail(email);
        if (!user || user.restricted) throw new Error(ERRORS.VALIDATION_ERROR);
        await User.updateOperation(OPERATION_STATUS.OTP_CORRECT,{user_id: user.id, name: OPERATION_NAME.FORGOT_PASSWORD, otp, password, email:user.email});
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}