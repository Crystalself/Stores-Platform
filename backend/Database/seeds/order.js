const knex = require('../config/knex');
const userSeeder = require('./user');
const { randomFloat, randomString } = require('./utils');
const { ORDER_STATUS } = require('../../Controllers/utils/enums');

const tableName = 'order';

/**
 * Seed the order table with random data
 * @param {number} count - Number of records to create
 * @param {boolean} clearExisting - Whether to clear existing data first
 * @returns {Promise<Array>} - Created records IDs
 */
async function seed(count = 15, clearExisting = false) {
  try {
    // Clear existing data if requested
    if (clearExisting) {
      await clear();
    }

    // Get user IDs to associate with orders
    const users = await userSeeder.getAllUserIds();
    
    if (users.length === 0) {
      throw new Error('No users found. Please seed users first.');
    }
    
    // Sample product data
    const sampleProducts = [
      { id: 1, name: 'Product 1', price: 29.99, quantity: 1 },
      { id: 2, name: 'Product 2', price: 49.99, quantity: 2 },
      { id: 3, name: 'Product 3', price: 9.99, quantity: 3 },
      { id: 4, name: 'Product 4', price: 19.99, quantity: 1 },
      { id: 5, name: 'Product 5', price: 39.99, quantity: 2 }
    ];
    
    // Create order records
    const orderRecords = [];
    
    for (let i = 0; i < count; i++) {
      // Random user ID
      const userId = users[Math.floor(Math.random() * users.length)].id;
      
      // Random number of products in order (1-4)
      const numProducts = Math.floor(Math.random() * 4) + 1;
      const orderProducts = [];
      
      // Add random products to order
      for (let j = 0; j < numProducts; j++) {
        const productIndex = Math.floor(Math.random() * sampleProducts.length);
        const product = {...sampleProducts[productIndex]};
        product.quantity = Math.floor(Math.random() * 3) + 1;
        orderProducts.push(product);
      }
      
      // Calculate total
      const total = orderProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      // Random status
      const statusValues = Object.values(ORDER_STATUS);
      const status = statusValues[Math.floor(Math.random() * statusValues.length)];
      
      // Random paid and delivery values based on status
      const paid = status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.SHIPPED || Math.random() > 0.5;
      const delivery = status === ORDER_STATUS.DELIVERED || (status === ORDER_STATUS.SHIPPED && Math.random() > 0.5);
      
      orderRecords.push({
        user_id: userId,
        products: JSON.stringify(orderProducts),
        total,
        message: Math.random() > 0.7 ? `Order note ${randomString(10)}` : null,
        paid,
        delivery,
        status,
        address: `${Math.floor(Math.random() * 1000) + 1} Main St, City, State, ${Math.floor(10000 + Math.random() * 90000)}`
      });
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(orderRecords).returning('id');
    console.log(`Created ${insertedIds.length} order records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding order table:', error);
    throw error;
  }
}

/**
 * Clear all records from the order table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from order table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing order table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
