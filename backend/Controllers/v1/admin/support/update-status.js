const Support = require("../../../../Classes/Support");
const { ERRORS, SUPPORT_TICKET_STATUS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    status: string().oneOf(Object.values(SUPPORT_TICKET_STATUS)).required(),
    upgrade_message: string().max(500),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, status, upgrade_message } = req.body;
        await Support.updateTicketStatus(id, status, req.admin.id, upgrade_message);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 