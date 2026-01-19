const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

router.post("/send", authMiddleware.authenticate, chatController.sendMessage);
router.get("/messages", authMiddleware.authenticate, chatController.getMessages);

module.exports = router;
