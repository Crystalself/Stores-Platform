const knex = require('../config/knex');
const userSeeder = require('./user');
const { randomFloat } = require('./utils');

const tableName = 'cart';

/**
 * Seed the cart table with random data
 * @param {number} count - Number of records to create
 * @param {boolean} clearExisting - Whether to clear existing data first
 * @returns {Promise<Array>} - Created records IDs
 */
async function seed(count = 10, clearExisting = false) {
  try {
    // Clear existing data if requested
    if (clearExisting) {
      await clear();
    }

    // Get user IDs to associate with carts
    const users = await userSeeder.getAllUserIds();
    
    if (users.length === 0) {
      throw new Error('No users found. Please seed users first.');
    }
    
    // Make sure we don't try to create more carts than users
    const actualCount = Math.min(count, users.length);
    
    // Shuffle user IDs to randomly select some
    const shuffledUserIds = users.map(u => u.id).sort(() => 0.5 - Math.random());
    const selectedUserIds = shuffledUserIds.slice(0, actualCount);
    
    // Sample product data
    const sampleProducts = [
      { id: 1, name: 'Product 1', price: 29.99, quantity: 1 },
      { id: 2, name: 'Product 2', price: 49.99, quantity: 2 },
      { id: 3, name: 'Product 3', price: 9.99, quantity: 3 }
    ];
    
    // Create cart records
    const cartRecords = selectedUserIds.map(userId => {
      // Random number of products in cart (1-3)
      const numProducts = Math.floor(Math.random() * 3) + 1;
      const cartProducts = [];
      
      // Add random products to cart
      for (let i = 0; i < numProducts; i++) {
        const product = {...sampleProducts[i]};
        product.quantity = Math.floor(Math.random() * 5) + 1;
        cartProducts.push(product);
      }
      
      // Calculate total
      const total = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      return {
        user_id: userId,
        products: JSON.stringify(cartProducts),
        total
      };
    });
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(cartRecords).returning('id');
    console.log(`Created ${insertedIds.length} cart records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding cart table:', error);
    throw error;
  }
}

/**
 * Clear all records from the cart table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from cart table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing cart table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
