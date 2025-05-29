
const adminSeeder = require('./admin');
const userSeeder = require('./user');
const customerSeeder = require('./customer');
const cartSeeder = require('./cart');
const orderSeeder = require('./order');
const messageSeeder = require('./message');
const operationSeeder = require('./operation');
const otpSeeder = require('./otp');
const supportMessagesSeeder = require('./support_messages');

// Group seeders by type
const CORE_SEEDERS = {
  admin: adminSeeder,
  user: userSeeder,
  customer: customerSeeder
};

const OPERATIONAL_SEEDERS = {
  cart: cartSeeder,
  order: orderSeeder,
  message: messageSeeder,
  operation: operationSeeder,
  otp: otpSeeder,
  supportMessages: supportMessagesSeeder
};

// Combine all seeders
const ALL_SEEDERS = {
  ...CORE_SEEDERS,
  ...OPERATIONAL_SEEDERS
};

/**
 * Main seeding function to populate the database with initial data
 * @param {Object} options - Configuration options for seeding
 * @param {number} options.adminCount - Number of admin records to create
 * @param {number} options.userCount - Number of user records to create
 * @param {number} options.customerCount - Number of customer records to create
 * @param {boolean} options.clearExisting - Whether to clear existing data before seeding
 * @param {boolean} options.seedAll - Whether to seed all tables including operational ones
 * @returns {Promise<void>}
 */
async function seed(options = {}) {
  const {
    adminCount = 5,
    userCount = 20,
    customerCount = 15,
    cartCount = 10,
    orderCount = 15,
    messageCount = 30,
    operationCount = 20,
    otpCount = 10,
    supportMessagesCount = 15,
    clearExisting = false,
    seedAll = false
  } = options;

  console.log('Starting database seeding...');
  
  try {
    // Always seed core tables
    console.log(`Seeding ${adminCount} admin records...`);
    await adminSeeder.seed(adminCount, clearExisting);
    
    console.log(`Seeding ${userCount} user records...`);
    await userSeeder.seed(userCount, clearExisting);
    
    console.log(`Seeding ${customerCount} customer records...`);
    await customerSeeder.seed(customerCount, clearExisting);
    
    // Seed operational tables only if explicitly requested
    if (seedAll) {
      console.log('Seeding operational tables...');
      
      console.log(`Seeding ${cartCount} cart records...`);
      await cartSeeder.seed(cartCount, clearExisting);
      
      console.log(`Seeding ${orderCount} order records...`);
      await orderSeeder.seed(orderCount, clearExisting);
      
      console.log(`Seeding ${messageCount} message records...`);
      await messageSeeder.seed(messageCount, clearExisting);
      
      console.log(`Seeding ${operationCount} operation records...`);
      await operationSeeder.seed(operationCount, clearExisting);
      
      console.log(`Seeding ${otpCount} OTP records...`);
      await otpSeeder.seed(otpCount, clearExisting);
      
      console.log(`Seeding ${supportMessagesCount} support message records...`);
      await supportMessagesSeeder.seed(supportMessagesCount, clearExisting);
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}

/**
 * Reset all seeded tables to empty state
 * @param {boolean} allTables - Whether to clear all tables including operational ones
 */
async function clearAll(allTables = false) {
  try {
    console.log('Clearing seeded tables...');
    
    // If clearing all tables, clear operational tables first (to respect foreign keys)
    if (allTables) {
      await supportMessagesSeeder.clear();
      await otpSeeder.clear();
      await operationSeeder.clear();
      await messageSeeder.clear();
      await orderSeeder.clear();
      await cartSeeder.clear();
    }
    
    // Always clear core tables
    await customerSeeder.clear();
    await userSeeder.clear();
    await adminSeeder.clear();
    
    console.log('All tables cleared successfully');
  } catch (error) {
    console.error('Error clearing tables:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clearAll,
  CORE_SEEDERS,
  OPERATIONAL_SEEDERS,
  ALL_SEEDERS
};
