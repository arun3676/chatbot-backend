// api/chat.js
const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  // Set CORS headers to allow your website to access this API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow any origin for testing
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, persona } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'The server is not properly configured with an API key'
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7
    });

    return res.status(200).json({
      message: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message
    });
  }
};