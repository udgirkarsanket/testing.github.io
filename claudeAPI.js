const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.CLAUDE_API_KEY;
  const API_URL = 'https://api.anthropic.com/v1/chat/completions';

  try {
    const { message, fileData } = JSON.parse(event.body);

    const response = await axios.post(API_URL, {
      model: 'claude-3-sonnet-20240229',
      messages: [
        {role: 'system', content: 'You are a helpful assistant that analyzes data and answers questions.'},
        {role: 'user', content: Here's the data I'm working with: ${JSON.stringify(fileData)}. ${message}}
      ],
      max_tokens: 1000,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response.data.content[0].text }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};
