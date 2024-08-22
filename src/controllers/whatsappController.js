const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt", { flags: "a" }))
const whatsappService = require("../services/whatsappService")
const AdConversation = require("../domain/AdConversation")
const samples = require("../shared/sampleModels");

class WhatsappController{
  adConversations = []
  constructor(){}

  verifyToken(req, res){
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
  
  receiveMessage = (req, res) => {
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

        let data
        if(currentConversation.step === 0){
          data = this.step0Message()
          currentConversation.nextStep()
        }

        if(currentConversation.step === 1){
          data = this.step0Message()
          currentConversation.nextStep()
          //requisição pra api de inferencia
          //categoria
          //mensagem: vamos publicar na categoria xxxxx
        }


        if(currentConversation.step === 3){
          //pede descrição
        }

        if(currentConversation.step === 4){
          //pede preço
        }
        
        if(currentConversation.step === 5){
          //pede cep
          //buscaCep => Campeche, Florianópolis
        }
        
        console.log('sending:::', data)
        //whatsappService.sendWhatsappMessage(data)
      }
      res.send("EVENT_RECEIVED");
    } catch (error) {
      res.send("EVENT_RECEIVED");
    }
  
    res.send("receive messagge");
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
    } 
    else {
      myConsole.log("sem mensagem")
    }
  
    return text;
  }

  step0Message() {
    return samples.sampleButtons('Boas vindas ao OLX-Bot. Bora publicar um anúncio via whatsapp?', number, ['Sim!', 'Agora não'])
  }
}


module.exports = {
  WhatsappController
}
