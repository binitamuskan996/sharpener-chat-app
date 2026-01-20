require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const sequelize = require("./utils/db-connection");
const User = require("./models/userModel");
const Message = require("./models/message");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

User.hasMany(Message);
Message.belongsTo(User);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;

    socket.user = await User.findByPk(socket.userId);

    if (!socket.user) {
      return next(new Error("User not found"));
    }

    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name);

  socket.on("chat-message", async (text) => {
    try {
      const savedMsg = await Message.create({
        UserId: socket.userId,
        message: text
      });

      const payload = {
        userId: socket.userId,
        username: socket.user.name,
        message: text,
        createdAt: savedMsg.createdAt
      };

      io.emit("chat-message", payload);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.name);
  });
});

sequelize
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (Socket.IO)`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
