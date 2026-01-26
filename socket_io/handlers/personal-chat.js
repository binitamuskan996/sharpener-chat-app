const Message = require("../../models/message");

module.exports = (socket, io) => {

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.user.name} joined room ${roomName}`);
  });

  socket.on("new-message", async (data) => {
    try {
      const savedMessage = await Message.create({
        message: data.message,
        UserId: socket.user.id
      });
      io.to(data.roomName).emit("new-message", {
        senderId: socket.user.id,
        senderName: socket.user.name,
        message: data.message,
        media: data.media || false,
        fileType: data.fileType || null,
        fileName: data.fileName || null
      });
    } catch (error) {
      console.error("Personal message save failed:", error);
    }
  });
};
