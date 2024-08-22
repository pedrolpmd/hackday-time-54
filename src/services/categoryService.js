const axios = require('axios');
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsCategory.txt", { flags: "a" }));

async function getMaxImages(parentId) {
  try {
    const response = await axios.get(
      `https://ck-gw.olx.com.br/manager/categories/${parentId}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.settings.max_images
  } catch (error) {
    myConsole.log('cat error:', JSON.stringify(error));
  }
}

async function getCategorySlug(categoryId) {
  try {
    const response = await axios.get(
      `https://clodoview-api.olx.com.br/view/ad-form-fields-${categoryId}-web/render`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data
  } catch (error) {
    myConsole.log('cat error:', JSON.stringify(error));
  }
}

module.exports = {
  getMaxImages,
  getCategorySlug
};
