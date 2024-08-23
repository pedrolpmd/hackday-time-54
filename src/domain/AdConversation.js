class AdConversation {
  step = 0;
  subject = '';
  category = {
    id: '',
    mainName: '',
    name: '',
    parentId: '',
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

  setCategory(categoryId, categoryName, categoryMainName, categoryParentId) {
    this.category.id = categoryId
    this.category.name = categoryName
    this.category.mainName = categoryMainName
    this.category.parentId = categoryParentId
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
    this.image.push(image);
  }

  setCategoryField(field) {
    this.categoryFields.push(field);
  }

  setCompleteCategoryField(field) {
    const categoryFields = this.categoryFields

    const completedIndex = categoryFields.findIndex(incompleteField => incompleteField.title === field.title)

    categoryFields[completedIndex] = field
    this.categoryFields = categoryFields
  }
}

module.exports = AdConversation;
