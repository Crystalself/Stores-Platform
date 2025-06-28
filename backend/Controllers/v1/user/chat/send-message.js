const Chat = require("../../../../Classes/Chat");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    chat_id: number().min(0).max(1000000000).required(),
    message: string().min(1).max(1000).required(),
    attachment: string().max(500),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { chat_id, message, attachment } = req.body;
        const newMessage = await Chat.sendMessage(chat_id, req.user.id, message, attachment);
        res.status(200).send({
            statusCode: 200,
            data: newMessage,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 