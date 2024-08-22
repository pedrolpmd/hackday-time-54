const axios = require('axios');
const fs = require("fs");
const FormData = require("form-data")
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

    const response = await axios.get(url, {
      headers: headers,
    });

    const { url: imageUrl } = response.data

    const { data } = await axios.get(imageUrl, {
      headers: headers,
    })

    
    const mediaBuffer = Buffer.from(image.data, 'binary');

    await uploadMedia(image.data)
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
        'x-api-key':'',
      }
    })

    console.log(response)
  } catch (error) {
    const a = error
    const b = '1'
  }
}

async function uploadMediaLink(link) {
  const url = `http://image-upload-service.olxbr.cloud/image`;

  const form = new FormData()
  form.append('image_uri', 'https://img.olx.com.br/images/35/356927032569841.jpg')

  try {
    const response = await axios.post(url, form, {
      headers: {
        'x-api-key':'sVFwNbBouFyltZ5d1dpIXMnr05HQBE77CBL1n73gr4t105',
      }
    })

    console.log(response)
  } catch (error) {
    const a = error
    const b = '1'
  }
}

module.exports = {
  sendWhatsappMessage,
  downloadMedia
};
