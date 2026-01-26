const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");
const geminiController=require('../controllers/geminiController');

router.post("/send", authMiddleware.authenticate, chatController.sendMessage);
router.get("/messages", authMiddleware.authenticate, chatController.getMessages);

router.post("/suggest",authMiddleware.authenticate,geminiController.suggestMessage);
router.post("/smart-replies",authMiddleware.authenticate,geminiController.smartReply);

module.exports = router;
