module.exports = (socket, io) => {

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.user.name} joined room ${roomName}`);
  });

  socket.on("new-message", (data) => {
  io.to(data.roomName).emit("new-message", {
    senderId: socket.user.id,
    senderName: socket.user.name,
    message: data.message,
    media: data.media || false,
    fileType: data.fileType || null,
    fileName: data.fileName || null
  });
});
};
