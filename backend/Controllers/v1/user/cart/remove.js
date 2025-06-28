const Cart = require("../../../../Classes/Cart");
const { ERRORS} = require("../../../utils/enums");
const { object, number} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const {id} = req.body;
        const cart = await Cart.getCart(id);
        if (!cart) throw new Error(ERRORS.CART_DOES_NOT_EXIST);
        if(cart.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        const count = await Cart.removeCart(id);
        res.status(200).send({
            statusCode: 200,
            count,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};