const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt", { flags: "a" }))

function sampleText(textReponse, number) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "text",
    "text": {
      "body": textReponse
    }
  });

  return data
}

function sampleImage(number, link, text) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "image",
    "image": {
      "caption":text,
      "link": link
    }
  });

  return data
}

function sampleAudio(number) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "audio",
    "audio": {
      "link": "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/audio_whatsapp.mp3"
    }
  });

  return data
}

function sampleVideo(number, text, link) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "video",
    "video": {
      "link": link
    },
    "caption": text
  });

  return data
}

function sampleDocument(number) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "document",
    "document": {
      "link": "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf"
    }
  });

  return data
}

function sampleButtons(command, number, options) {
  const buttons = []
  for (let index = 0; index < options.length; index++) {
    const button = {
      "type": "reply",
      "reply": {
        "id": index,
        "title": options[index]
      }
    }
    buttons.push(button)
  }
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": command
      },
      "action": {
        "buttons": buttons
      }
    }
  });

  return data
}

function sampleLocation(number, caption) {
  const data = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": number,
    "type": "location",
    "location": {
      "latitude": "-48.5070997",
      "longitude": "-27.6898591",
      "name": "Clínica do Dr. Rodrigo",
      "address": "Rua das Três Palmeiras Reais, 90"
    },
    "caption": caption
  });

  return data
}

function sampleMenu(number, options, text) {
  try {
    const generateButtons = () => {
      let buttons = []
      for (let index = 0; index < options.length; index++) {

        let option = {
          "id": options[index].key,
          "title": options[index].value,
        }
        buttons.push(option)
      }

      return buttons
    }

    const data = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": number,
      "type": "interactive",
      "interactive": {
        "type": "list",
        "body": {
          "text": text
        },
        "action": {
          "button": "Opções",
          "sections": [
            {
              "rows": generateButtons()
            },
          ]
        }
      }
    });

    return data
  } catch (error) {
    myConsole.log('deu pau aqui:::', error)
  }

}

module.exports = {
  sampleText,
  sampleImage,
  sampleAudio,
  sampleVideo,
  sampleDocument,
  sampleButtons,
  sampleLocation,
  sampleMenu
}
