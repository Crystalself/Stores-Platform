const knex = require('../config/knex');
const { randomFloat } = require('./utils');
const userSeeder = require('./user');

const tableName = 'customer';

/**
 * Seed the customer table with random data
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

    // Get user IDs to associate with customers
    const users = await userSeeder.getAllUserIds();
    
    if (users.length === 0) {
      throw new Error('No users found. Please seed users first.');
    }
    
    // Make sure we don't try to create more customers than users
    const actualCount = Math.min(count, users.length);
    
    // Shuffle user IDs to randomly select some
    const shuffledUserIds = users.map(u => u.id).sort(() => 0.5 - Math.random());
    const selectedUserIds = shuffledUserIds.slice(0, actualCount);
    
    // Create customer records
    const customerRecords = selectedUserIds.map(userId => ({
      user_id: userId,
      credit: randomFloat(0, 500, 2)
    }));
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(customerRecords).returning('id');
    console.log(`Created ${insertedIds.length} customer records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding customer table:', error);
    throw error;
  }
}

/**
 * Clear all records from the customer table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from customer table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing customer table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
