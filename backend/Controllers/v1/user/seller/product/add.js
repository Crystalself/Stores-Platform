const Product = require("../../../../../Classes/Product");
const { ERRORS, CATEGORY} = require("../../../../utils/enums");
const { object, number, string, array} = require("yup");
const Helper = require("../../../../utils/Helper");

const schema = object({
    name: string().min(3).max(100).required(),
    description: string().min(10).max(2000).required(),
    thumbnail_image: Helper.yupImgValidation.required(),
    images: array().of(Helper.yupImgValidation.required()),
    category: string().oneOf(Object.values(CATEGORY)).required(),
    price: number().min(0).max(1000000000).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { name, description, thumbnail_image, images, category, price} = req.body;
        await Product.addNewProduct(req.user.id, name, description, thumbnail_image, images, category, price);
        res.status(200).send({
            statusCode: 200,
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
};