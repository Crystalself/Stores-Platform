const Chat = require("../../../../Classes/Chat");
const { ERRORS} = require("../../../utils/enums");
const { object, number} = require("yup");

const schema = object({
    user_id: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { user_id } = req.body;
        if (user_id === req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        const chat = await Chat.createChat(req.user.id, user_id);
        res.status(200).send({
            statusCode: 200,
            data: chat,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 