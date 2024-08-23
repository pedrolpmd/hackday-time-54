const axios = require('axios');
const sharp = require('sharp');
const fs = require("fs");
const FormData = require("form-data")
const myConsole = new console.Console(fs.createWriteStream("./logsZap.txt", { flags: "a" }));

async function sendWhatsappMessage(data) {
  try {
    await axios.post('https://graph.facebook.com/v20.0/224233857431273/messages', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAMVhQNh7JkBOxq4BnIaXHbrJauEEw7dyYm7GiR23ZBmZAGnGcHRkCdLMczmWz3xPbgVjE9whMG9J7ZAYUS50Idb0LTqrsACDGf9qoZANesSrsNwSXFYL3e4ZCWeIl5FqRJNpy26CPq9LCyPmaktu3OgweojCDZC4hpah2ccTiZBDjBOjrJCzhXx2JQiHFzZBOwecZBDctqTAqmPaGZBZBI2S4ZD',
      }
    });

  } catch (error) {
    myConsole.log('error:', error.message);
  }
}

async function downloadMedia(mediaId) {
  try {

    const fbGetMediaUrl = `https://graph.facebook.com/v11.0/${mediaId}`;
    const headers = {
      'Authorization': 'Bearer EAAMVhQNh7JkBOxq4BnIaXHbrJauEEw7dyYm7GiR23ZBmZAGnGcHRkCdLMczmWz3xPbgVjE9whMG9J7ZAYUS50Idb0LTqrsACDGf9qoZANesSrsNwSXFYL3e4ZCWeIl5FqRJNpy26CPq9LCyPmaktu3OgweojCDZC4hpah2ccTiZBDjBOjrJCzhXx2JQiHFzZBOwecZBDctqTAqmPaGZBZBI2S4ZD',
    };

    const { id, url } = await processImage(fbGetMediaUrl, headers);
    return { id, url }
  }
  catch (error) {
    myConsole.log('error:', error.message);
  }
}

async function processImage(fbGetMediaUrl, headers) {
  try {
    const response = await axios.get(fbGetMediaUrl, { headers: headers });
    const { url: imageUrl } = response.data;
    
    const imageResponse = await axios.get(imageUrl, { headers: headers, responseType: 'arraybuffer'})
    const jfifBuffer = imageResponse.data;

    const jpgBuffer = await sharp(jfifBuffer).jpeg().toBuffer();

    const { id, url } = await uploadMedia(jpgBuffer)
    return { id, url }
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

    return { id: response.data.id, url: response.data.uri}
  } catch (error) {
    myConsole.log('error:', error.message);
  }
}



module.exports = {
  sendWhatsappMessage,
  downloadMedia
};
