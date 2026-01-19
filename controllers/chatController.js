const Message = require("../models/message");
const User = require('../models/userModel')

const sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) return res.status(400).json({ message: "Message is empty" });

  try {
    const msg = await Message.create({ userId, message });
    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "ASC"]],
      include: { model: User, attributes: ["name"] }
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getMessages, sendMessage }