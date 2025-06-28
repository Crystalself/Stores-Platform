const Chat = require("../../../../Classes/Chat");
const { ERRORS} = require("../../../utils/enums");
const { object, number} = require("yup");

const schema = object({
    chat_id: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { chat_id } = req.body;
        await Chat.markChatMessagesAsRead(chat_id, req.user.id);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 