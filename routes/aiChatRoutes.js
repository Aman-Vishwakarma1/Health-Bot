const express = require("express");
const router = express.Router();

const { aiChat, aiChatExit } = require("../controllers/aiChatController");

router.post("/", aiChat);
router.post("/exit", aiChatExit);

module.exports = router;
