const knex = require('../config/knex');
const { hashPassword, randomEmail, randomPassword, randomName, randomPhone } = require('./utils');

const tableName = 'user';

/**
 * Seed the user table with random data
 * @param {number} count - Number of records to create
 * @param {boolean} clearExisting - Whether to clear existing data first
 * @returns {Promise<Array>} - Created records IDs
 */
async function seed(count = 20, clearExisting = false) {
  try {
    // Clear existing data if requested
    if (clearExisting) {
      await clear();
    }

    // Create user records
    const userRecords = [];
    
    // Always create one default user for testing
    userRecords.push({
      name: 'Test User',
      email: 'user@example.com',
      password: await hashPassword('user123'),
      phone: '+19876543210',
      verified: true
    });
    
    // Generate random users for the rest
    for (let i = 1; i < count; i++) {
      const name = randomName();
      const email = randomEmail();
      const plainPassword = randomPassword();
      
      // Store the plain passwords for development reference
      console.log(`User ${i+1}: ${email} / ${plainPassword}`);
      
      userRecords.push({
        name,
        email,
        password: await hashPassword(plainPassword),
        phone: randomPhone(),
        verified: Math.random() > 0.2 // 80% of users are verified
      });
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(userRecords).returning('id');
    console.log(`Created ${insertedIds.length} user records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding user table:', error);
    throw error;
  }
}

/**
 * Get all user IDs from the database
 * @returns {Promise<Array>} - Array of user IDs
 */
async function getAllUserIds() {
  return knex(tableName).select('id');
}

/**
 * Clear all records from the user table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from user table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing user table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear,
  getAllUserIds
};
