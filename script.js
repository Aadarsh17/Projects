document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  form.addEventListener('submit', fetchResults);
});

async function fetchResults(event) {
  event.preventDefault();

  const input = document.getElementById('text-input');
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, 'user');
  input.value = '';
  updateChatWindow();

  await fetchApiResponse(userText);
}

async function fetchApiResponse(userText) {
  const apiKey = 'AIzaSyDq385Di-mFHHwWZjgXVnxqpiRwSW9-FGs';

  // Gemini API Endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Request body format for Gemini API
  const body = {
    contents: [
      {
        parts: [{ text: userText }]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);

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
    console.error('API call failed:', error);
    appendMessage('Sorry, something went wrong.', 'bot');
  }

  updateChatWindow();
}

function appendMessage(message, sender) {
  const chatWindow = document.getElementById('chat-window');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatWindow.appendChild(messageDiv);
}

function updateChatWindow() {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function formatResponse(text) {
  return text
    .trim()
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
