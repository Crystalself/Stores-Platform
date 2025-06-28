const {Order, knex} = require("../../../../Database/models");
const { ERRORS} = require("../../../utils/enums");
const { object, number, string, boolean} = require("yup");

const schema = object({
    offset: number().min(0).max(1000000000).required(),
    limit: number().min(1).max(30).required(),
    status: string(),
    paid: boolean(),
    delivery: boolean(),
    order: object({
        column: string()
            .oneOf(["created_at", "total", "status", "paid", "delivery"])
            .required(),
        direction: string().oneOf(["asc", "desc"]).required(),
    }).required(),
});

module.exports = async (req, res, next) => {
    try {
        const isValid = await schema.isValid(req['body']);
        if (!isValid) throw new Error(ERRORS.VALIDATION_ERROR);
        const { offset, limit, status, paid, delivery, order } = req.body;
        
        const query = Order()
            .select("order.*", "user.first_name", "user.last_name", "user.email")
            .join("user", "order.user_id", "user.id");
        
        if (status) query.where({status});
        if (paid !== undefined) query.where({paid});
        if (delivery !== undefined) query.where({delivery});
        
        const [{count}] = await query.count("order.id as count");
        const data = await query.offset(offset).limit(limit).orderBy(`order.${order.column}`, order.direction);
        
        res.status(200).send({
            statusCode: 200,
            data,
            count: parseInt(count),
            message: 'success',
        });
    } catch (e) {
        next(e);
    }
}; 