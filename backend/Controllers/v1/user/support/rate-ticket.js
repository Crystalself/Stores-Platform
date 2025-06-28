const Support = require("../../../../Classes/Support");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    rating: number().min(1).max(5).required(),
    review: string().max(500),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, rating, review } = req.body;
        await Support.rateTicket(id, req.user.id, rating, review);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 