const {Chat, Message, User, knex} = require("../Database/models");
const {ERRORS} = require("../Controllers/utils/enums");

module.exports = class {
    static messageQuery = (limit = 20, offset = 0) => {
        return knex.select("message.*", "user.first_name as sender_name", "user.profile_pic as sender_pic")
            .from("message")
            .join("user", "message.sender", "user.id")
            .orderBy("message.created_at", "desc")
            .limit(limit)
            .offset(offset)
            .as("messages");
    }
    
    static async createChat(first_user_id, second_user_id) {
        // Check if chat already exists
        const existingChat = await Chat()
            .where(function() {
                this.where({first: first_user_id, second: second_user_id})
                    .orWhere({first: second_user_id, second: first_user_id});
            })
            .first();
        
        if (existingChat) return existingChat;
        
        const [chat] = await Chat().insert({
            first: first_user_id,
            second: second_user_id,
            data: {}
        }).returning('*');
        
        return chat;
    }
    
    static async getChat(id) {
        return Chat().where({id}).first();
    }
    
    static async getUserChats(user_id, offset, limit) {
        const query = Chat()
            .select("chat.*", 
                knex.raw("CASE WHEN chat.first = ? THEN u2.first_name ELSE u1.first_name END as other_user_name", [user_id]),
                knex.raw("CASE WHEN chat.first = ? THEN u2.profile_pic ELSE u1.profile_pic END as other_user_pic", [user_id]),
                knex.raw("CASE WHEN chat.first = ? THEN u2.id ELSE u1.id END as other_user_id", [user_id])
            )
            .join("user as u1", "chat.first", "u1.id")
            .join("user as u2", "chat.second", "u2.id")
            .where(function() {
                this.where({first: user_id}).orWhere({second: user_id});
            });
        
        const [{count}] = await query.count("chat.id as count");
        const data = await query.offset(offset).limit(limit).orderBy("chat.updated_at", "desc");
        
        return {data, count: parseInt(count)};
    }
    
    static async getChatWithMessages(id, messages_limit, messages_offset) {
        const chat = await Chat()
            .select("*", this.messageQuery(messages_limit, messages_offset))
            .where({id})
            .first();
        
        if (!chat) throw new Error(ERRORS.CHAT_DOES_NOT_EXIST);
        
        return chat;
    }
    
    static async sendMessage(chat_id, sender_id, message, attachment = null) {
        const chat = await this.getChat(chat_id);
        if (!chat) throw new Error(ERRORS.CHAT_DOES_NOT_EXIST);
        
        // Verify sender is part of the chat
        if (chat.first !== sender_id && chat.second !== sender_id) {
            throw new Error(ERRORS.VALIDATION_ERROR);
        }
        
        const [newMessage] = await Message().insert({
            chat_id,
            sender: sender_id,
            message,
            attachment,
            received: false,
            read: false
        }).returning('*');
        
        // Update chat's updated_at
        await Chat().update({updated_at: knex.fn.now()}).where({id: chat_id});
        
        return newMessage;
    }
    
    static async markAsReceived(message_id) {
        return Message().update({received: true}).where({id: message_id});
    }
    
    static async markAsRead(message_id) {
        return Message().update({read: true, received: true}).where({id: message_id});
    }
    
    static async markChatMessagesAsRead(chat_id, user_id) {
        const chat = await this.getChat(chat_id);
        if (!chat) throw new Error(ERRORS.CHAT_DOES_NOT_EXIST);
        
        const other_user_id = chat.first === user_id ? chat.second : chat.first;
        
        return Message()
            .update({read: true, received: true})
            .where({chat_id, sender: other_user_id, read: false});
    }
} 