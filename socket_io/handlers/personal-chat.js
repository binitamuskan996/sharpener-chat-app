module.exports = (socket, io) => {
  
  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.user.name} joined room: ${roomName}`);
  });

  socket.on("new-message", ({message, roomName}) => {
    console.log("User", socket.user.username, "said:", message);

    io.emit("new-message", { username: socket.user.username, message });
  });
};