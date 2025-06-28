const Support = require("../../../../Classes/Support");
const { ERRORS} = require("../../../utils/enums");
const { object, string} = require("yup");

const schema = object({
    topic: string().min(3).max(200).required(),
    description: string().min(10).max(1000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { topic, description } = req.body;
        const ticket = await Support.createTicket(req.user.id, topic, description);
        res.status(200).send({
            statusCode: 200,
            data: ticket,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 