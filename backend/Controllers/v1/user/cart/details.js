const Cart = require("../../../../Classes/Cart");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
    offset: number().min(0).max(10000).required(),
    order: object({
        column: string()
            .oneOf(["id", "quantity", "price", "name"])
            .required(),
        direction: string().oneOf(["asc", "desc"]).required(),
    }).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, limit, offset, order} = req.body;
        const cart = await Cart.getCart(id);
        if (!cart) throw new Error(ERRORS.CART_DOES_NOT_EXIST);
        if(cart.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        if(order.column === 'id') order.column = 'cart_product.created_at';
        else if (order.column === 'quantity') order.column = 'cart_product.quantity';
        else order.column = `product.${order.column}`;
        const data = await Cart.getCartDetails(id, limit, offset, order);
        const count = await Cart.getCartItemsCount(id);
        res.status(200).send({
            statusCode: 200,
            data,
            count,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};