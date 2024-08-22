const axios = require('axios');
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsCep.txt", { flags: "a" }));

async function getLocation(zipcode) {
  try {
    const response = await axios.get(
      `https://busca-cep.olx.com.br/cep/${zipcode}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data
  } catch (error) {
    myConsole.log('cep error:', JSON.stringify(error));
  }
}

module.exports = {
  getLocation
};
