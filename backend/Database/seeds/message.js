const knex = require('../config/knex');
const userSeeder = require('./user');
const { randomString } = require('./utils');

const tableName = 'message';

/**
 * Seed the message table with random data
 * @param {number} count - Number of records to create
 * @param {boolean} clearExisting - Whether to clear existing data first
 * @returns {Promise<Array>} - Created records IDs
 */
async function seed(count = 30, clearExisting = false) {
  try {
    // Clear existing data if requested
    if (clearExisting) {
      await clear();
    }

    // Get user IDs to associate with messages
    const users = await userSeeder.getAllUserIds();
    
    if (users.length === 0 || users.length < 2) {
      throw new Error('Not enough users found. Please seed at least 2 users first.');
    }
    
    // Create message records
    const messageRecords = [];
    
    // Create some conversations between users
    const conversations = Math.min(10, Math.floor(users.length / 2));
    
    for (let i = 0; i < conversations; i++) {
      // Get two random users for a conversation
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const user1 = shuffledUsers[0].id;
      const user2 = shuffledUsers[1].id;
      
      // Generate messages between these users
      const messagesPerConversation = Math.floor(count / conversations);
      
      for (let j = 0; j < messagesPerConversation; j++) {
        // Alternate sender
        const sender = j % 2 === 0 ? user1 : user2;
        const receiver = j % 2 === 0 ? user2 : user1;
        
        messageRecords.push({
          sender_id: sender,
          receiver_id: receiver,
          content: `Message ${j + 1}: ${randomString(20)}`,
          read: Math.random() > 0.3 // 70% of messages are read
        });
      }
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(messageRecords).returning('id');
    console.log(`Created ${insertedIds.length} message records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding message table:', error);
    throw error;
  }
}

/**
 * Clear all records from the message table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from message table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing message table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
