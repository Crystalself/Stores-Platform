const Product = require("../../../../../Classes/Product");
const { ERRORS, CATEGORY} = require("../../../../utils/enums");
const {object, string, array, number, boolean} = require("yup");
const Helper = require("../../../../utils/Helper");

const schema = object({
    id: number().min(1).max(1000000000).required(),
    name: string().min(3).max(100),
    description: string().min(10).max(2000),
    thumbnail_image: Helper.yupImgValidation,
    images: array().of(Helper.yupImgValidation.required()),
    category: string().oneOf(Object.values(CATEGORY)),
    price: number().min(0).max(1000000000),
    discount: number().min(0).max(100),
    in_stock: boolean()
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { id, name, description, thumbnail_image, images, category, price, discount, in_stock} = req.body;
        const product = await Product.getProduct(id);
        if( !product || product.user_id !== req.user.id) throw new Error(ERRORS.VALIDATION_ERROR);
        if( !name || !description || !thumbnail_image || !images || !category || !price || !discount || !in_stock) throw new Error(ERRORS.VALIDATION_ERROR);
        await Product.editProduct(product, name, description, thumbnail_image, images, category, price, discount, in_stock);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};