class Conversation {
  messages = []
  step = 0

  constructor(number) {
    this.number = number
  }

  addMessage(message) {
    this.messages.push(message)
  }
}

module.exports = Conversation
