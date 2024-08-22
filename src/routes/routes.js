const express = require("express");
const router = express.Router();
const { WhatsappController } = require("../controllers/whatsappController");

const whatsappController = new WhatsappController()

router
.get("/", whatsappController.verifyToken)
.post("/", whatsappController.receiveMessage)

module.exports = router;
