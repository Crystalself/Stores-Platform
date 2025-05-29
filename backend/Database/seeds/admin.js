const knex = require('../config/knex');
const { hashPassword, randomEmail, randomPassword, randomName, randomPhone } = require('./utils');

const tableName = 'admin';

/**
 * Seed the admin table with random data
 * @param {number} count - Number of records to create
 * @param {boolean} clearExisting - Whether to clear existing data first
 * @returns {Promise<Array>} - Created records IDs
 */
async function seed(count = 5, clearExisting = false) {
  try {
    // Clear existing data if requested
    if (clearExisting) {
      await clear();
    }

    // Create admin records
    const adminRecords = [];
    
    // Always create one default admin for testing
    adminRecords.push({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      phone: '+11234567890'
    });
    
    // Generate random admins for the rest
    for (let i = 1; i < count; i++) {
      const name = randomName();
      const email = randomEmail();
      const plainPassword = randomPassword();
      
      // Store the plain passwords for development reference
      console.log(`Admin ${i+1}: ${email} / ${plainPassword}`);
      
      adminRecords.push({
        name,
        email,
        password: await hashPassword(plainPassword),
        phone: randomPhone()
      });
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(adminRecords).returning('id');
    console.log(`Created ${insertedIds.length} admin records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding admin table:', error);
    throw error;
  }
}

/**
 * Clear all records from the admin table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from admin table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing admin table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
