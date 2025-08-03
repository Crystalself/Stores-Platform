const express = require('express');
const router = express.Router();
const { askGemini } = require('../../utils/geminiService');

/**
 * POST /api/v1/chatbot/ask
 * Ask a question to the AI chatbot
 * Body: { message: "..." }
 * Returns: { reply: "..." }
 */
router.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                message: 'Message is required and must be a non-empty string',
                statusCode: 400
            });
        }

        // Get response from Gemini AI
        const reply = await askGemini(message.trim());

        res.json({
            reply: reply,
            statusCode: 200
        });

    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({
            message: error.message || 'Internal server error',
            statusCode: 500
        });
    }
});

module.exports = router; 