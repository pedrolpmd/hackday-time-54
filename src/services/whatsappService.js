const https = require('https');
const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsZap.txt", { flags: "a" }))

function sendWhatsappMessage(data) {
  const options = {
    hostname: 'graph.facebook.com',
    path: '/v20.0/224233857431273/messages',
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer EAAMVhQNh7JkBO148KRruopSYToLbGf2huiW9rQjIognygNAqxOp9cw62Gb1TMjqjZC7UxZC2QaK5jRixTq3FviKvHpIvMXbVxt0oZAIAszHtVpsqSQtntwkZCNRu2PJWRfOkFldPz1wR7TNOAObZBvKQjvdkvdZB9RSykFblRxWeIpgIHJjjnAP2ZClaH3ehuGUFd83j5zGaThw9C0GNepCLAZDZD',
    }
  };
  
  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
    });
  });

  req.on('error', (error) => {
    myConsole.log('error:', error)
  });

  req.write(data);
  req.end();
}

module.exports = {
  sendWhatsappMessage
}
