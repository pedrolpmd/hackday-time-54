const axios = require('axios');
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsInference.txt", { flags: "a" }));

async function getCategory(product) {
  try {
    const response = await axios.get(
      `https://ad-insertion-bff.seller.ads.prod.olxbr.io/v2/recommendations/${product}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data[0]
  } catch (error) {
    myConsole.log('inf error:', JSON.stringify(error));
  }
}

module.exports = {
  getCategory
};
