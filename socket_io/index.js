const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handlers/chat");
const personalChatHandler = require("./handlers/personal-chat");
const groupChat = require("./handlers/group-chat");

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
    personalChatHandler(socket, io);
    groupChat(io, socket);
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.name);
    });
  });

  return io;
};