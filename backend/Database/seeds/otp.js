const knex = require('../config/knex');
const userSeeder = require('./user');
const { randomString } = require('./utils');

const tableName = 'otp';

/**
 * Seed the OTP table with random data
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

    // Get user IDs to associate with OTPs
    const users = await userSeeder.getAllUserIds();
    
    if (users.length === 0) {
      throw new Error('No users found. Please seed users first.');
    }
    
    // Create OTP records
    const otpRecords = [];
    
    const otpTypes = ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'ACCOUNT_ACTIVATION'];
    
    for (let i = 0; i < count; i++) {
      // Random user ID
      const userId = users[Math.floor(Math.random() * users.length)].id;
      const type = otpTypes[Math.floor(Math.random() * otpTypes.length)];
      
      // Generate 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiry time (between 1-24 hours from now)
      const expiryHours = Math.floor(Math.random() * 24) + 1;
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + expiryHours);
      
      otpRecords.push({
        user_id: userId,
        code,
        type,
        expiry: expiryTime,
        used: Math.random() > 0.7 // 30% are used
      });
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(otpRecords).returning('id');
    console.log(`Created ${insertedIds.length} OTP records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding OTP table:', error);
    throw error;
  }
}

/**
 * Clear all records from the OTP table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from OTP table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing OTP table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
