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

async function downloadMedia(mediaId, mimeType) {
  try {

    const url = `https://graph.facebook.com/v11.0/${mediaId}`;
    const headers = {
      'Authorization': 'Bearer EAAMVhQNh7JkBO148KRruopSYToLbGf2huiW9rQjIognygNAqxOp9cw62Gb1TMjqjZC7UxZC2QaK5jRixTq3FviKvHpIvMXbVxt0oZAIAszHtVpsqSQtntwkZCNRu2PJWRfOkFldPz1wR7TNOAObZBvKQjvdkvdZB9RSykFblRxWeIpgIHJjjnAP2ZClaH3ehuGUFd83j5zGaThw9C0GNepCLAZDZD',
    };

    const responseBuffer = await axios.get(url, {
      headers: headers,
      responseType: 'arraybuffer'
    });

    const responseUrl = await axios.get(url, {
      headers: headers,
    });

    // Convert the binary data to a Buffer
    const mediaBuffer = Buffer.from(responseBuffer.data, 'binary');

    // Save the file or return the Buffer for further processing
    const filePath = `./downloads/${mediaId}.${mimeType.split('/')[1]}`;
    fs.writeFileSync(filePath, mediaBuffer);

    return filePath;
  }
  catch (error) {
    const a = error
  }
}

module.exports = {
  sendWhatsappMessage,
  downloadMedia
};
