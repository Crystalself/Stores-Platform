const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Ask Gemini AI a question and get a response
 * @param {string} message - The user's message/question
 * @returns {Promise<string>} - The AI's response
 */
async function askGemini(message) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a context-aware prompt for the stores platform
        const systemPrompt = `You are a helpful customer service assistant for a stores platform. 
        You help customers with questions about:
        - Store information and locations
        - Product categories and availability
        - Pricing and offers
        - Shopping policies and procedures
        - General platform usage
        
        Keep your responses friendly, helpful, and concise. If you don't know specific details about stores or products, 
        suggest that the customer contact the specific store or check the platform for current information.
        
        User question: ${message}`;

        // Generate content
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Sorry, I am unable to process your request at the moment. Please try again later.');
    }
}

module.exports = {
    askGemini
}; 