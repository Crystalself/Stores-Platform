const Cart = require("../../../../Classes/Cart");
const Order = require("../../../../Classes/Order");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    address: string().min(5).max(500).required(),
    message: string().max(500),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, address, message } = req.body;

        await Cart.checkCartTotal(id);
        const order = await Order.createOrder(req.user.id, id, address, message);

        res.status(200).send({
            statusCode: 200,
            data: order,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};