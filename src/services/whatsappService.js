const axios = require('axios');
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsZap.txt", { flags: "a" }));

async function sendWhatsappMessage(data) {
  try {
    const response = await axios.post('https://graph.facebook.com/v20.0/224233857431273/messages', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAMVhQNh7JkBO148KRruopSYToLbGf2huiW9rQjIognygNAqxOp9cw62Gb1TMjqjZC7UxZC2QaK5jRixTq3FviKvHpIvMXbVxt0oZAIAszHtVpsqSQtntwkZCNRu2PJWRfOkFldPz1wR7TNOAObZBvKQjvdkvdZB9RSykFblRxWeIpgIHJjjnAP2ZClaH3ehuGUFd83j5zGaThw9C0GNepCLAZDZD',
      }
    });

    myConsole.log('Response:', response.data);
  } catch (error) {
    myConsole.log('error:', error.message);
  }
}

module.exports = {
  sendWhatsappMessage
};
