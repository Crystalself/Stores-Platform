const knex = require('../config/knex');
const { randomString } = require('./utils');

const tableName = 'operation';

/**
 * Seed the operation table with random data
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

    // Create operation records
    const operationRecords = [];
    
    const operationTypes = [
      'USER_REGISTRATION', 
      'USER_LOGIN', 
      'ADMIN_LOGIN', 
      'PASSWORD_RESET', 
      'PRODUCT_CREATE',
      'ORDER_CREATE',
      'PAYMENT_PROCESS'
    ];
    
    for (let i = 0; i < count; i++) {
      const type = operationTypes[Math.floor(Math.random() * operationTypes.length)];
      const status = Math.random() > 0.1 ? 'SUCCESS' : 'FAILURE'; // 90% success rate
      
      operationRecords.push({
        type,
        status,
        details: JSON.stringify({
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date().toISOString(),
          requestId: randomString(12)
        })
      });
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(operationRecords).returning('id');
    console.log(`Created ${insertedIds.length} operation records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding operation table:', error);
    throw error;
  }
}

/**
 * Clear all records from the operation table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from operation table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing operation table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
