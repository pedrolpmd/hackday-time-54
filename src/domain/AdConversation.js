class AdConversation {
  messages = [];
  step = 0;
  subject = '';
  category = {
    categoryId: null,
    categoryName: '',
    categoryMainName: ''
  };
  body = '';
  price = null;
  address = {
    zipcode: null,
    bairro: '',
    cidade: ''
  };
  image = [];
  categoryFields = [];

  constructor(number) {
    this.number = number;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  nextStep() {
    this.step = this.step + 1;
  }

  previousStep() {
    this.step = this.step - 1;
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setCategory(categoryId, categoryName, categoryMainName) {
    this.category.categoryId = categoryId
    this.category.categoryName = categoryName
    this.category.categoryMainName = categoryMainName
  }

  setBody(body) {
    this.body = body;
  }

  setPrice(price) {
    this.price = price;
  }

  setAddress(zipcode, bairro, cidade) {
    this.address.zipcode = zipcode
    this.address.bairro = bairro
    this.address.cidade = cidade
  }
  setImage(image) {
    this.image = image;
  }

  setCategoryFields(categoryFields) {
    this.categoryFields = categoryFields;
  }
}

module.exports = AdConversation;
