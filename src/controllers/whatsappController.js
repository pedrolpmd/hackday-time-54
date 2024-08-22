const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt", { flags: "a" }))
const whatsappService = require("../services/whatsappService")
const inferenceService = require("../services/inferenceService")
const buscaCepService = require("../services/buscaCepService")
const categoryService = require("../services/categoryService")
const AdConversation = require("../domain/AdConversation")
const samples = require("../shared/sampleModels");

class WhatsappController {
  adConversations = []
  constructor() { }

  verifyToken(req, res) {
    try {
      const accessToken = "RV04fBAWBZS03P9MBFYDVIIRYzEUF"
      const token = req.query["hub.verify_token"]
      const challenge = req.query["hub.challenge"]

      if (challenge !== null && token !== null && token == accessToken) {
        res.send(challenge)
      } else {
        res.status(400).send()
      }

    } catch (error) {
      res.status(400).send()
    }

  }

  addConversation = (conversation) => {
    this.adConversations.push(conversation)
  }

  receiveMessage = async (req, res) => {
    try {
      const entry = (req.body["entry"])[0]
      const changes = (entry["changes"])[0]
      const value = changes["value"];
      const messageObject = value["messages"];

      if (typeof messageObject != "undefined") {
        const messages = messageObject[0];
        const number = messages["from"];

        let currentConversation = this.adConversations.find(conversation => conversation.number == number);
        if (!currentConversation) {
          currentConversation = new AdConversation(number);
          this.addConversation(currentConversation);
        }

        const text = this.getTextUser(messages);

        if (currentConversation.step === 0) {
          const data = this.stepWelcome(number)
          whatsappService.sendWhatsappMessage(data)
          currentConversation.nextStep()
          res.status(200).send()
          return
        }

        if (currentConversation.step === 1) {
          if (text === 'Sim!') {
            const data = this.stepTitle(number)
            whatsappService.sendWhatsappMessage(data)
            currentConversation.nextStep()
          } else {
            const data = this.stepGoodbye(number)
            whatsappService.sendWhatsappMessage(data)
            currentConversation.step = 0
          }
          res.status(200).send()
          return
        }

        if (currentConversation.step === 2) {
          currentConversation.setSubject(text)
          const category = await inferenceService.getCategory(text)
          currentConversation.setCategory(
            category.category_id,
            category.category_name,
            category.category_main_name,
            category.parent_id
          )

          const data = this.stepCategoryConfirmation(number, category)
          await whatsappService.sendWhatsappMessage(data)

          const descriptionData = this.stepDescription(number, currentConversation.subject)
          await whatsappService.sendWhatsappMessage(descriptionData)

          currentConversation.nextStep()
          res.status(200).send()
          return
        }


        if(currentConversation.step === 3){
          currentConversation.setBody(text, currentConversation.subject)
          const data = this.stepPrice(number)
          whatsappService.sendWhatsappMessage(data)
          currentConversation.nextStep()
          res.status(200).send()
          return
        }


        if (currentConversation.step === 4) {
          //recebe preço
          //seta preço
          //pede cep
        }

        if (currentConversation.step === 5) {
          const { result } = await buscaCepService.getLocation(text)
          currentConversation.setAddress(result.cep, result.bairro_distrito, result.localidade)
          const maxImages = await categoryService.getMaxImages(currentConversation.category.categoryParentId)
          const data = this.stepImages(number, maxImages)
          whatsappService.sendWhatsappMessage(data)
          currentConversation.nextStep()
          res.status(200).send()
          return
        }

        if (currentConversation.step === 6) {
          const { id, mimetype } = text;
          const media = await whatsappService.downloadMedia(id, mimetype)
          const b = 1
        }


      }
    } catch (error) {
      myConsole.log('error:::', JSON.stringify(error))
    }
  }

  getTextUser(messages) {
    let text = "";
    const typeMessage = messages["type"];
    myConsole.log('message::', messages)
    if (typeMessage == "text") {
      text = (messages["text"])["body"];
    } else if (typeMessage == "interactive") {
      const interactiveObject = messages["interactive"];
      const typeInteractive = interactiveObject["type"];

      if (typeInteractive == "button_reply") {
        text = (interactiveObject["button_reply"])["title"];
      } else if (typeInteractive == "list_reply") {
        text = (interactiveObject["list_reply"])["title"];
      } else {
        myConsole.log("sem mensagem")
      }
    } else if (typeMessage == "image") {
      text =  {
        id: messages.image.id,
        mimetype: messages.image.mime_type
      }
    } else {
      myConsole.log("sem mensagem")
    }

    return text;
  }

  stepWelcome(number) {
    return samples.sampleButtons('Boas vindas ao OLX-Bot. Bora publicar um anúncio via whatsapp?', number, ['Sim!', 'Agora não'])
  }

  stepTitle(number) {
    return samples
      .sampleText('Para começar, envie o título do que você quer vender:', number)
  }

  stepGoodbye(number) {
    return samples
      .sampleText('Quando quiser publicar um anúncio, envie uma mensagem aqui :)', number)
  }

  stepCategoryConfirmation(number, category) {
    return samples
      .sampleText(`
        Vamos publicar seu anúncio na categoria: ${category.category_main_name} > ${category.category_name}`,
        number
      )
  }

  stepDescription(number, product) {
    return samples
      .sampleText(`Agora, crie uma descrição para seu ${product}`, number)
  }

  stepPrice(number, product) {
    return samples
      .sampleText(`Por quanto você quer vender ${product}?`, number)
  }

  stepImages(number, maxImages) {
    return samples
      .sampleText(`Agora vamos adicionar imagens ao seu anúncio. Envie até ${maxImages} fotos.`, number)
  }
}


module.exports = {
  WhatsappController
}
