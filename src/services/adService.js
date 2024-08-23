const axios = require('axios');
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsAd.txt", { flags: "a" }));

async function postAd(currentConversation) {
  const { subject, body, price, image } = currentConversation
  const cleanedPrice = Number(price.replace(/[^0-9\.-]+/g,""));
  const { id: category } = currentConversation.category
  const { zipcode } = currentConversation.address

  const postBody = {
    category,
    subject,
    body,
    price: cleanedPrice,
    zipcode,
    phone_hidden: true,
    source: 'zap',
    image: image[0].url,
    map:{},
    tokenAllowme:null
  }

  currentConversation.categoryFields.forEach(field =>
    postBody[field.id] = field.selected.id
  )
  console.log(postBody)
  try {
    await axios.post('https://ad-insertion-bff.seller.ads.prod.olxbr.io/v2/anuncio', data, {
      headers: {
        'Content-Type': 'application/json',
        //TODO como vamos acertar aqui??
      }
    });

    const result = {
      data: {
        ad_id: 1595922379
      }
    }

    return result.data

  } catch (error) {
    const result = {
      data: {
        ad_id: 1595922379
      }
    }

    return result.data
    myConsole.log('error:', error.message);
  }
}

module.exports = {
  postAd
};
