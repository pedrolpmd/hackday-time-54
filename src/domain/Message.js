class Message {
  constructor(text, from) {
    this.text = text;
    this.from = from
  }

  addText(text, from) {
    this.text = text;
    this.from = from;
  }

  getMessage() {
    return {
      text: this.text,
      from: this.from
    }
  }
}