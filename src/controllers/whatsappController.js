const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt", { flags: "a" }))
const whatsappService = require("../services/whatsappService")
const Conversation = require("../domain/Conversation")
const samples = require("../shared/sampleModels");

class WhatsappController{
  conversations = []
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
    this.conversations.push(conversation)
  }
  
  receiveMessage = (req, res) => {
    try {
      myConsole.log('conversations::', this.conversations)
      const entry = (req.body["entry"])[0]
      const changes = (entry["changes"])[0]
      const value = changes["value"];
      const messageObject = value["messages"];
  
      if (typeof messageObject != "undefined") {
        const messages = messageObject[0];
        const number = messages["from"];

        let currentConversation = this.conversations.find(conversation => conversation.number == number);
        if (!currentConversation) {
          currentConversation = new Conversation(number);
          this.addConversation(currentConversation);
        }

        const text = this.getTextUser(messages);
        
        const data = samples.sampleButtons('Boas vindas ao OLX-Bot. Bora publicar um anúncio via whatsapp?', number, ['Sim!', 'Agora não'])
  
        whatsappService.sendWhatsappMessage(data)
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
}


module.exports = {
  WhatsappController
}
