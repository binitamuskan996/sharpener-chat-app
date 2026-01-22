module.exports = (socket, io) => {

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.user.name} joined room ${roomName}`);
  });

  socket.on("new-message", ({ message, roomName }) => {
    io.to(roomName).emit("new-message", {
      senderId: socket.user.id,
      senderName: socket.user.name,
      senderEmail: socket.user.email,
      message
    });
  });
};
