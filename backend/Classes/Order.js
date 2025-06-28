const {Order, Cart, Cart_product, knex} = require("../Database/models");
const {ERRORS, ORDER_STATUS} = require("../Controllers/utils/enums");

module.exports = class {
    static async createOrder(user_id, cart_id, address, message = null) {
        const cart = await Cart().where({id: cart_id, user_id}).first();
        if (!cart) throw new Error(ERRORS.CART_DOES_NOT_EXIST);
        
        const cartProducts = await Cart_product()
            .select("cart_product.*", "product.name", "product.price", "product.discount", "product.thumbnail_image")
            .join("product", "cart_product.product_id", "product.id")
            .where({cart_id});
        
        if (cartProducts.length === 0) throw new Error(ERRORS.CART_IS_EMPTY);
        
        const products = cartProducts.map(item => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            discount: item.discount,
            quantity: item.quantity,
            thumbnail_image: item.thumbnail_image,
            total: item.price * (1 - item.discount/100) * item.quantity
        }));
        
        const [order] = await Order().insert({
            user_id,
            products,
            total: cart.total,
            message,
            paid: false,
            delivery: false,
            status: ORDER_STATUS.PENDING,
            address
        }).returning('*');
        
        // Clear the cart after order creation
        await Cart_product().where({cart_id}).del();
        await Cart().update({total: 0}).where({id: cart_id});
        
        return order;
    }
    
    static async getOrder(id) {
        return Order().where({id}).first();
    }
    
    static async getUserOrders(user_id, offset, limit, order = {column: "created_at", direction: "desc"}) {
        const query = Order().where({user_id});
        const [{count}] = await query.count("id as count");
        const data = await query.offset(offset).limit(limit).orderBy(order.column, order.direction);
        return {data, count: parseInt(count)};
    }
    
    static async updateOrderStatus(id, status) {
        return Order().update({status}).where({id});
    }
    
    static async cancelOrder(id, user_id) {
        const order = await this.getOrder(id);
        if (!order) throw new Error(ERRORS.ORDER_DOES_NOT_EXIST);
        if (order.user_id !== user_id) throw new Error(ERRORS.VALIDATION_ERROR);
        if (order.status === ORDER_STATUS.CANCELLED) throw new Error(ERRORS.ORDER_ALREADY_CANCELLED);
        if ([ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED].includes(order.status)) {
            throw new Error(ERRORS.ORDER_CANNOT_BE_CANCELLED);
        }
        return this.updateOrderStatus(id, ORDER_STATUS.CANCELLED);
    }
    
    static async markAsPaid(id) {
        return Order().update({paid: true}).where({id});
    }
    
    static async markAsDelivered(id) {
        return Order().update({delivery: true, status: ORDER_STATUS.DELIVERED}).where({id});
    }
} 