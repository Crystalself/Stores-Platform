const {object, string} = require('yup');
const {ERRORS} = require("../../../utils/enums");
const User = require("../../../../Classes/User");
const schema = object({
    old_pass: string().min(8).max(100).required(),
    new_pass: string().min(8).max(100).required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {old_pass , new_pass} = req.body;
        await User.changePassword(req.user.id, old_pass, new_pass)
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}