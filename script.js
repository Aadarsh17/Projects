const PROXY_URL = 'https://script.google.com/macros/s/AKfycbz6_Xxyge1sDu1412GGjjd44WiC47L-QK20pZd8zV8dciE8Ymi9nx6-gN-9bnxKcvidhw/exec';

async function fetchApiResponse(userText) {
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: userText })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Proxy API response:', data);

    // Extract AI reply from data
    let aiReply = "Sorry, I couldn't get a response.";

    if (
      data?.candidates &&
      Array.isArray(data.candidates) &&
      data.candidates.length > 0
    ) {
      const content = data.candidates[0].content;
      if (
        content &&
        content.parts &&
        Array.isArray(content.parts) &&
        content.parts.length > 0
      ) {
        aiReply = content.parts[0].text || aiReply;
      }
    }

    appendMessage(formatResponse(aiReply), 'bot');
  } catch (error) {
    console.error('Proxy call failed:', error);
    appendMessage('Sorry, something went wrong.', 'bot');
  }

  updateChatWindow();
}