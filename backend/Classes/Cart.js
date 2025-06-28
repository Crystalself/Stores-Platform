const {Cart, Cart_product, knex} = require("../Database/models");
const Product = require("./Product");
const {ERRORS, LIMITS} = require("../Controllers/utils/enums");

module.exports = class {
    static productsQuery = (limit = 5, offset = 0, order ) => {
        return knex.select("product.*" + knex.raw("COALESCE(cart_product.quantity, 0) as quantity"))
            .from("cart")
            .join("cart_product", function () {
                this.on("cart.id", "=", "cart_product.cart_id")
            })
            .join("product", function () {
                this.on("product.id", "=", "cart_product.product_id")
            })
            .limit(limit)
            .offset(offset)
            .orderBy(order.column, order.direction)
            .as("products");
    }

    static async getCart(id) {
        return Cart().where({id}).first();
    }

    static async getCartDetails(id, products_limit, products_offset, order = {column: "cart_product.created_at", direction: "desc"}) {
        return Cart().select("*" , this.productsQuery(products_limit, products_offset, order)).where({id}).first();
    }

    static async getCartItemsCount(id) {
        const [{count}] = await Cart_product().where({cart_id: id}).count("id as count");
        return parseInt(count);
    }

    static async getCarts(user_id) {
        return Cart().select("*" , this.productsQuery()).where({user_id});
    }

    static async getCartsCount(user_id) {
        const [{count}] = await Cart().where({user_id}).count("id as count");
        return parseInt(count);
    }

    static async addToCart(id, product_id, quantity) {
        const product = await Product.getCheckedProduct(product_id);
        await this.updateCartTotal(id, product_id, quantity, product);
        const existingProduct = await Cart_product().where({cart_id: id, product_id}).first();
        if(existingProduct) return Cart_product().increment("quantity", quantity).where({cart_id:id, product_id});
        return Cart_product().insert({cart_id:id, product_id, quantity});
    }

    static async addToNewCart(user_id, product_id, quantity) {
        const count = await this.getCartsCount(user_id);
        if (count === LIMITS.CART_LIMIT) throw new Error(ERRORS.CART_LIMIT_REACHED);
        const product = await Product.getCheckedProduct(product_id);
        const total = await this.updateCartTotal(null, product_id, quantity, product);
        const cart = await Cart().insert({user_id, total}).returning("id");
        return Cart_product().insert({cart_id: cart[0].id, product_id, quantity});
    }

    static async updateCartTotal(id, product_id, quantity, product = null) {
        if (!product) product = await Product.getCheckedProduct(product_id);
        const addedTotal = product.price * (1 - product.discount/100) * quantity;
        if(id) {
            const cart = await this.getCart(id);
            return Cart().update({total: cart.total + addedTotal}).where({id});
        }
        return addedTotal
    }

    static async removeCart(id) {
        const count = await Cart().where({id}).del();
        return parseInt(count);
    }

    static async removeCartItem(id, product_id) {
        const cartProduct = await Cart_product().where({cart_id: id, product_id}).first();
        if(!cartProduct) throw new Error(ERRORS.PRODUCT_IS_NOT_IN_CART);
        await this.updateCartTotal(id, product_id, -cartProduct.quantity);
        const count = await Cart_product().where({cart_id: id, product_id}).del();
        return parseInt(count);
    }

    static async updateCartItemQuantity(id, product_id, quantity) {
        const cartProduct = await Cart_product().where({cart_id: id, product_id}).first();
        if(!cartProduct) throw new Error(ERRORS.PRODUCT_IS_NOT_IN_CART);
        await this.updateCartTotal(id, product_id, quantity - cartProduct.quantity);
        return Cart_product().update({quantity}).where({cart_id: id, product_id});
    }

    static async checkCartTotal(id) {
        const cartProducts = await this.getCartDetails(id, LIMITS.CART_ITEMS_LIMIT, 0);
        let total = 0;
        cartProducts.products.forEach(product => {
            total += product.price * (1 - product.discount/100) * product.quantity;
        })
        if(total !== cartProducts.total) await Cart.update({total}).where({id});
        return total;
    }
}