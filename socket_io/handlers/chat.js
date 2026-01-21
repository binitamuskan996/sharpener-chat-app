const Message = require("../../models/message");

module.exports = (socket, io) => {
  socket.on("chat-message", async (message) => {
    try {
      console.log("User", socket.user.name, "said:", message);

      const savedMessage = await Message.create({
        message: message,
        UserId: socket.user.id,
      });

      io.emit("chat-message", { 
        username: socket.user.name, 
        message: message,
        createdAt: savedMessage.createdAt
      });
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};