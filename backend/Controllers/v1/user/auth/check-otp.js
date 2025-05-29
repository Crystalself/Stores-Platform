const {object, string} = require('yup');
const User = require("../../../../Classes/User")
const {ERRORS, OPERATION_NAME, OPERATION_STATUS} = require("../../../utils/enums");
const schema = object({
    email: string().email().max(255).required(),
    otp: string().length(4).required()
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {email, otp} = req.body;
        const user = await User.getUserByEmail(email);
        if (!user || user.restricted) throw new Error(ERRORS.VALIDATION_ERROR);
        await User.updateOperation(OPERATION_STATUS.OTP_SENT,{user_id: user.id, name: OPERATION_NAME.FORGOT_PASSWORD, otp});
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}