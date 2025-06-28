const Order = require("../../../../Classes/Order");
const { ERRORS, ORDER_STATUS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    status: string().oneOf(Object.values(ORDER_STATUS)).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, status } = req.body;
        await Order.updateOrderStatus(id, status);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 