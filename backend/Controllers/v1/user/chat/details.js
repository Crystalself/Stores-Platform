const Chat = require("../../../../Classes/Chat");
const { ERRORS} = require("../../../utils/enums");
const { object, number} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    messages_limit: number().min(1).max(50).required(),
    messages_offset: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, messages_limit, messages_offset } = req.body;
        const chat = await Chat.getChatWithMessages(id, messages_limit, messages_offset);
        // Verify user is part of the chat
        if (chat.first !== req.user.id && chat.second !== req.user.id) {
            throw new Error(ERRORS.VALIDATION_ERROR);
        }
        res.status(200).send({
            statusCode: 200,
            data: chat,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 