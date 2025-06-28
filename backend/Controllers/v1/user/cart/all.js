const Cart = require("../../../../Classes/Cart");

module.exports = async (req, res, next) => {
    try {
        const data = await Cart.getCarts(req.user.id);
        const count = await Cart.getCartsCount(req.user.id);
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