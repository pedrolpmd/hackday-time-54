function extractOptionsFromCkFields(slug) {
  const { data, template } = slug

  const categoryFields = []
  template.forEach(ckField => {
    if (ckField.id !== 'price') {
      const field = {}
      const fieldData = data.ckfields.find(field => field.code === ckField.id)
      const label = fieldData.extra_data.label
      field.title = label
      field.options = fieldData.datasource.values.slice(0, 5);
      categoryFields.push(field);
    }
  })

  return categoryFields
}

module.exports = {
  extractOptionsFromCkFields
};
