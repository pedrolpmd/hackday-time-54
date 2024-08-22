const axios = require('axios');
const https = require('https');
const sharp = require('sharp');
const fs = require("fs");
const FormData = require("form-data")
const myConsole = new console.Console(fs.createWriteStream("./logsZap.txt", { flags: "a" }));

async function sendWhatsappMessage(data) {
  try {
    await axios.post('https://graph.facebook.com/v20.0/224233857431273/messages', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAMVhQNh7JkBO148KRruopSYToLbGf2huiW9rQjIognygNAqxOp9cw62Gb1TMjqjZC7UxZC2QaK5jRixTq3FviKvHpIvMXbVxt0oZAIAszHtVpsqSQtntwkZCNRu2PJWRfOkFldPz1wR7TNOAObZBvKQjvdkvdZB9RSykFblRxWeIpgIHJjjnAP2ZClaH3ehuGUFd83j5zGaThw9C0GNepCLAZDZD',
      }
    });

  } catch (error) {
    myConsole.log('error:', error.message);
  }
}

async function downloadMedia(mediaId) {
  try {

    const url = `https://graph.facebook.com/v11.0/${mediaId}`;
    const headers = {
      'Authorization': 'Bearer EAAMVhQNh7JkBO148KRruopSYToLbGf2huiW9rQjIognygNAqxOp9cw62Gb1TMjqjZC7UxZC2QaK5jRixTq3FviKvHpIvMXbVxt0oZAIAszHtVpsqSQtntwkZCNRu2PJWRfOkFldPz1wR7TNOAObZBvKQjvdkvdZB9RSykFblRxWeIpgIHJjjnAP2ZClaH3ehuGUFd83j5zGaThw9C0GNepCLAZDZD',
    };

    const id = await processImage(url, headers);
    return id
  }
  catch (error) {
    myConsole.log('error:', error.message);
  }
}

async function processImage(url, headers) {
  try {
    const response = await axios.get(url, { headers: headers });
    const { url: imageUrl } = response.data;
    
    const imageResponse = await axios.get(imageUrl, { headers: headers, responseType: 'arraybuffer'})
    const jfifBuffer = imageResponse.data;

    const jpgBuffer = await sharp(jfifBuffer).jpeg().toBuffer();

    const id = await uploadMedia(jpgBuffer)
    return id
  } catch (error) {
    myConsole.log('error:', error.message);
  }
}

async function uploadMedia(buffer) {
  const url = `http://image-upload-service.olxbr.cloud/image`;

  const form = new FormData()
  form.append('file', buffer, 'image-name.jpg')

  try {
    const response = await axios.post(url, form, {
      headers: {
        'x-api-key': 'sVFwNbBouFyltZ5d1dpIXMnr05HQBE77CBL1n73gr4t105',
      }
    })

    return response.data.id
  } catch (error) {
    myConsole.log('error:', error.message);
  }
}



module.exports = {
  sendWhatsappMessage,
  downloadMedia
};
