const knex = require('../config/knex');
const { randomString } = require('./utils');

const tableName = 'support_messages';

/**
 * Seed the support_messages table with random data
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

    // First check if we have support tickets
    const supportTickets = await knex('support_ticket').select('id');
    
    if (supportTickets.length === 0) {
      console.warn('No support tickets found. Creating dummy support tickets first.');
      
      // Create some dummy support tickets
      const ticketCount = Math.ceil(count / 3); // Approximately 3 messages per ticket
      
      // Get some user IDs
      const users = await knex('user').select('id').limit(ticketCount);
      
      if (users.length === 0) {
        throw new Error('No users found. Please seed users first.');
      }
      
      const ticketSubjects = [
        'Payment issue', 
        'Order not delivered', 
        'Account problem',
        'Product inquiry',
        'Refund request'
      ];
      
      const ticketIds = [];
      
      for (let i = 0; i < ticketCount; i++) {
        const userId = users[i % users.length].id;
        const subject = ticketSubjects[Math.floor(Math.random() * ticketSubjects.length)];
        
        const [ticketId] = await knex('support_ticket').insert({
          user_id: userId,
          subject,
          status: Math.random() > 0.5 ? 'OPEN' : 'CLOSED',
          priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
        }).returning('id');
        
        ticketIds.push(ticketId);
      }
      
      console.log(`Created ${ticketIds.length} support tickets`);
    }
    
    // Get all support tickets
    const allTickets = await knex('support_ticket').select('id', 'user_id');
    
    // Create support message records
    const messageRecords = [];
    
    // Sample message contents
    const userMessages = [
      'I have a problem with my order',
      'My payment didn\'t go through',
      'When will my order be delivered?',
      'I need to change my delivery address',
      'Can I get a refund?'
    ];
    
    const adminResponses = [
      'Thank you for contacting us. We\'re looking into your issue.',
      'We apologize for the inconvenience. Our team is working on it.',
      'Your order has been updated. Please check your email for details.',
      'We have processed your request. Is there anything else we can help with?',
      'This issue has been resolved. Please let us know if you need further assistance.'
    ];
    
    // Distribute messages among tickets
    for (const ticket of allTickets) {
      // Number of messages for this ticket (1-5)
      const messagesForTicket = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < messagesForTicket; i++) {
        // First message is always from the user
        const isUserMessage = i === 0 || Math.random() > 0.5;
        
        messageRecords.push({
          ticket_id: ticket.id,
          sender_type: isUserMessage ? 'USER' : 'ADMIN',
          sender_id: isUserMessage ? ticket.user_id : null, // Admin ID would be null or from admin table
          content: isUserMessage 
            ? userMessages[Math.floor(Math.random() * userMessages.length)]
            : adminResponses[Math.floor(Math.random() * adminResponses.length)],
          read: Math.random() > 0.3 // 70% of messages are read
        });
      }
    }
    
    // Insert the records into the database
    const insertedIds = await knex(tableName).insert(messageRecords.slice(0, count)).returning('id');
    console.log(`Created ${insertedIds.length} support message records`);
    
    return insertedIds;
  } catch (error) {
    console.error('Error seeding support_messages table:', error);
    throw error;
  }
}

/**
 * Clear all records from the support_messages table
 * @returns {Promise<number>} - Number of deleted records
 */
async function clear() {
  try {
    const deleted = await knex(tableName).del();
    console.log(`Cleared ${deleted} records from support_messages table`);
    return deleted;
  } catch (error) {
    console.error('Error clearing support_messages table:', error);
    throw error;
  }
}

module.exports = {
  seed,
  clear
};
