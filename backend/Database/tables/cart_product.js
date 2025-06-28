module.exports = (table) => {
    table.integer('cart_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').unsigned().defaultTo(1);
    table.primary(['cart_id', 'product_id']);
    table.foreign('cart_id').references('cart.id').onDelete('CASCADE');
    table.foreign('product_id').references('product.id').onDelete('CASCADE');
};