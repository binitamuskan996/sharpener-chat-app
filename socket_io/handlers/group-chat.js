module.exports = (io, socket) => {

  socket.on("create-group", ({ groupId }) => {
    socket.join(groupId);
    console.log(`${socket.user.email} created group ${groupId}`);
  });

  socket.on("join-group", ({ groupId }) => {
    socket.join(groupId);
    console.log(`${socket.user.email} joined group ${groupId}`);
  });

  socket.on("group-message", (data) => {
  io.to(data.groupId).emit("group-message", {
    senderId: socket.user.id,
    senderName: socket.user.name,
    message: data.message,
    media: data.media || false,
    fileType: data.fileType || null,
    fileName: data.fileName || null
  });
});


};
