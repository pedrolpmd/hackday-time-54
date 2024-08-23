const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt", { flags: "a" }))
const whatsappService = require("../services/whatsappService")
const inferenceService = require("../services/inferenceService")
const buscaCepService = require("../services/buscaCepService")
const categoryService = require("../services/categoryService")
const adService = require("../services/adService")
const { extractOptionsFromCkFields } = require("../helpers/extract-options-from-ck-fields")
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

        if (currentConversation.step === 3) {
          currentConversation.setBody(text)
          const data = this.stepPrice(number, currentConversation.subject)
          whatsappService.sendWhatsappMessage(data)
          currentConversation.nextStep()
          res.status(200).send()
          return
        }


        if (currentConversation.step === 4) {
          currentConversation.setPrice(text)
          const data = this.stepZipCode(number)
          whatsappService.sendWhatsappMessage(data)
          currentConversation.nextStep()
          res.status(200).send()
          return
        }

        if (currentConversation.step === 5) {
          const response = await buscaCepService.getLocation(text)
          const { result } = response
          if (result) {
            currentConversation.setAddress(result.cep, result.bairro_distrito, result.localidade)
          }
          const maxImages = await categoryService.getMaxImages(currentConversation.category.parentId)
          const data = this.stepImages(number, maxImages ? maxImages : 3)
          whatsappService.sendWhatsappMessage(data)
          currentConversation.nextStep()
          res.status(200).send()
          return
        }

        if (currentConversation.step === 6) {
          const { mediaId, mimetype } = text;
          const { id, url } = await whatsappService.downloadMedia(mediaId)
          const fileExtension = mimetype.split('/')[1];
          currentConversation.setImage({ path: `${id}.${fileExtension}`, url })

          const data = this.stepCategoryFields(number)
          whatsappService.sendWhatsappMessage(data)
          res.status(200).send()

          const slug = await categoryService.getCategorySlug(currentConversation.category.id)
          const categoryFields = extractOptionsFromCkFields(slug)
          if (categoryFields) {
            categoryFields.forEach(field => {
              currentConversation.setCategoryField(field)
            })

            const firstIncompleteCategoryField = currentConversation.categoryFields[0]
            const data = this.stepCompleteCategoryField(number, firstIncompleteCategoryField)
            whatsappService.sendWhatsappMessage(data)
            currentConversation.nextStep()
            res.status(200).send()
            return
          } else {
            //TODO extrair esse tijolo
            const seeYourAdMessage = this.stepYourAd(number)
            await whatsappService.sendWhatsappMessage(seeYourAdMessage)
            const adLook = this.stepAdLook(number, currentConversation)
            await whatsappService.sendWhatsappMessage(adLook)
            const confirmMessage = this.stepPostConfirmation(number)
            await whatsappService.sendWhatsappMessage(confirmMessage)
            currentConversation.nextStep()
            res.status(200).send()
            return
          }
        }

        if (currentConversation.step === 7) {
          const { label, id } = text
          const incompleteCategoryField = currentConversation.categoryFields.find(field => field.selected === undefined)

          if (incompleteCategoryField) {
            const completededOption = incompleteCategoryField.options.find(option => option.key === id)
            if (completededOption) {
              const completeCategoryField = incompleteCategoryField
              completeCategoryField.selected = {
                label,
                id
              }
              currentConversation.setCompleteCategoryField(completeCategoryField)
            }

            const anotherIncompleteCategoryField = currentConversation.categoryFields.find(field => field.selected === undefined)

            if (anotherIncompleteCategoryField) {
              const data = this.stepCompleteCategoryField(number, anotherIncompleteCategoryField)
              whatsappService.sendWhatsappMessage(data)
              res.status(200).send()
              return
            } else {
              const seeYourAdMessage = this.stepYourAd(number)
              await whatsappService.sendWhatsappMessage(seeYourAdMessage)
              const adLook = this.stepAdLook(number, currentConversation)
              await whatsappService.sendWhatsappMessage(adLook)
              const confirmMessage = this.stepPostConfirmation(number)
              await whatsappService.sendWhatsappMessage(confirmMessage)
              currentConversation.nextStep()
              res.status(200).send()
              return
            }
          } else {
            const seeYourAdMessage = this.stepYourAd(number)
            await whatsappService.sendWhatsappMessage(seeYourAdMessage)
            const adLook = this.stepAdLook(number, currentConversation)
            await whatsappService.sendWhatsappMessage(adLook)
            const confirmMessage = this.stepPostConfirmation(number)
            await whatsappService.sendWhatsappMessage(confirmMessage)
            currentConversation.nextStep()
            res.status(200).send()
            return
          }

        }

        if(currentConversation.step === 8 ){
          if(text === 'Bora desapegar!'){
            const { ad_id } = await adService.postAd(currentConversation)
            //const listId = await adService.getListId(ad_id)
            const listId = 1330430472
            const publishedMessage = this.stepPublishedAd(number)
            await whatsappService.sendWhatsappMessage(publishedMessage)
            const finalData = this.stepFinalAd(number, currentConversation, listId)
            await whatsappService.sendWhatsappMessage(finalData)
            res.status(200).send()
            return
          } else {
            //TODO menu com campos das steps pra ele editar
          }
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
        text = {
          id: interactiveObject["list_reply"]["id"],
          label: interactiveObject["list_reply"]["title"]
        };
      } else {
        myConsole.log("sem mensagem")
      }
    } else if (typeMessage == "image") {
      text = {
        mediaId: messages.image.id,
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
      .sampleText(`Agora, crie uma descrição para seu ${product}:`, number)
  }

  stepPrice(number, product) {
    return samples
      .sampleText(`Por quanto você quer vender ${product}? (ex: R$200)`, number)
  }

  stepZipCode(number) {
    return samples
      .sampleText('Qual é o CEP da localização do produto?', number)
  }


  stepImages(number, maxImages) {
    return samples
      .sampleText(`Agora vamos adicionar imagens ao seu anúncio. Envie até ${maxImages} fotos.`, number)
  }

  stepCategoryFields(number) {
    return samples
      .sampleText('Para finalizar, vamos preencher informações específicas da categoria de seu anúncio', number)
  }

  stepCompleteCategoryField(number, field) {
    return samples
      .sampleMenu(number, field.options, `Selecione ${field.title} do seu produto:`)
  }

  stepYourAd(number) {
    return samples
      .sampleText('Confirme os dados do seu anúncio:', number)
  }

  stepAdLook(number, currentConversation) {
    const { url } = currentConversation.image[0]
    const text = this.createAdText(currentConversation)
    return samples
      .sampleImage(number, url, text)
  }

  createAdText = (currentConversation, listId) => {
    const { subject, body, price } = currentConversation
    const { bairro, cidade } = currentConversation.address
    const categoryFieldsList = []
    currentConversation.categoryFields.forEach(field =>
      categoryFieldsList.push({
        title: field.title,
        label: field.selected.label,
        id: field.selected.id
      })
    )

    let categoryFieldsText = '';
    categoryFieldsList.forEach((field) => {
      categoryFieldsText += `*${field.title}*: ${field.label}\n`;
    });

    // Constructing the final formatted text
    let adText = `
*${subject}*
${body}
  
${categoryFieldsText}
*Valor*: ${price}
*Local*: ${bairro} - ${cidade}`;

    if(listId){
      adText += `
‎ 
Link na *OLX*: https://www.olx.com.br/vi/${listId}`
    }
    return adText;
  }

  stepPostConfirmation(number) {
    return samples.sampleButtons(
      'Bora publicar esse anúncio top?', number, ['Bora desapegar!', 'Quero ajusar algo.'])
  }

  stepPublishedAd(number) {
    return samples
      .sampleText('Seu anúncio foi publicado!', number)
  }

  stepFinalAd = (number,currentConversation, listId) => {
    const { url } = currentConversation.image[0]
    const text = this.createAdText(currentConversation, listId)
    return samples
      .sampleImage(number, url, text)
  }

}


module.exports = {
  WhatsappController
}
