const Cart = require("../../../../Classes/Cart");
const { ERRORS, LIMITS} = require("../../../utils/enums");
const { object, number} = require("yup");

const schema = object({
    id: number().min(0).max(1000000000),
    product_id: number().min(0).max(1000000000).required(),
    quantity: number().min(1).max(1000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, product_id, quantity} = req.body;
        if(id){
            const cart = await Cart.getCart(id);
            if (!cart) throw new Error(ERRORS.CART_DOES_NOT_EXIST);
            if (cart.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
            const productsCount = await Cart.getCartItemsCount(id);
            if(productsCount === LIMITS.CART_ITEMS_LIMIT) throw new Error(ERRORS.CART_ITEMS_LIMIT_REACHED);
            await Cart.addToCart(id, product_id, quantity);
        }else {
            await Cart.addToNewCart(req.user.id, product_id, quantity);
        }
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};