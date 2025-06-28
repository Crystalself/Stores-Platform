const Product = require("../../../../../Classes/Product");
const { ERRORS} = require("../../../../../Controllers/utils/enums");
const {object, number} = require("yup");

const schema = object({
    id: number().min(1).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['query']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id } = req.query;
        const product = await Product.getProduct(id);
        if( !product || product.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        await Product.enlistProduct(id);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};