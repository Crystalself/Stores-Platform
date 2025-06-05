const { object, number } = require("yup");
const { ERRORS} = require("../../utils/enums");
const Product = require("../../../Classes/Product");

const schema = object({
    id: number().min(0).max(100).required(),
});
module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['query']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id } = req.query;
        const data = await Product.getProduct(id);
        if(!data) throw new Error(ERRORS.PRODUCT_DOES_NOT_EXIST);
        res.status(200).send({
            statusCode: 200,
            data,
            message: "success",
        });
    } catch (e) {
        next(e);
    }
};
