const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handlers/chat");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.name);

    chatHandler(socket, io);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.name);
    });
  });

  return io;
};