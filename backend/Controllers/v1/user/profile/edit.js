const {object, string} = require('yup');
const User = require('../../../../Classes/User');
const {ERRORS} = require("../../../utils/enums");
const schema = object({
    first_name: string().min(2).max(150).required(),
    last_name: string().min(2).max(150).required(),
    phone: string().min(10).max(20).required(),
    bank_name: string().min(2).max(150).required(),
    bank_account: string().min(2).max(150).required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {first_name, last_name, phone, bank_name, bank_account} = req.body;
        if(!(first_name || last_name || phone || bank_name || bank_account)) throw new Error(ERRORS.VALIDATION_ERROR);
        await User.editInfo(req.user.id, first_name, last_name, phone, bank_name, bank_account);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}