const Support = require("../../../../Classes/Support");
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
        const ticket = await Support.getTicketWithMessages(id, messages_limit, messages_offset);
        // Verify user owns the ticket
        if (ticket.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        res.status(200).send({
            statusCode: 200,
            data: ticket,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 