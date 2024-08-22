const axios = require('axios');
const https = require('https');
const sharp = require('sharp');
const fs = require("fs");
const FormData = require("form-data")
const myConsole = new console.Console(fs.createWriteStream("./logsZap.txt", { flags: "a" }));

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});


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

    await processImage(url, headers);
  }
  catch (error) {
    const a = error
  }
}

async function uploadMedia(buffer) {
  const url = `http://image-upload-service.olxbr.cloud/image`;

  const form = new FormData()
  form.append('file', buffer, 'image-name.jpg')

  try {
    const response = await axios.post(url, form, {
      headers: {
        'x-api-key': '',
      }
    })

    console.log(response)
  } catch (error) {
    const a = error
    const b = '1'
  }
}

async function processImage(url, headers) {
  try {
    const response = await axios.get(url, { headers: headers });
    const { url: imageUrl } = response.data;
    
    const imageResponse = await axiosInstance.get(imageUrl, { headers: headers, responseType: 'arraybuffer'})
    //const imageResponse = await axios.get(imageUrl, { headers: headers, responseType: 'arraybuffer' });
    const jfifBuffer = imageResponse.data;

    // Convert JFIF buffer to JPG buffer
    const jpgBuffer = await sharp(jfifBuffer).jpeg().toBuffer();

    await uploadMedia(jpgBuffer);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendWhatsappMessage,
  downloadMedia
};
