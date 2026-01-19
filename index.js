require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const jwt = require("jsonwebtoken");

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

const wss = new WebSocket.Server({ server });
let sockets = [];

wss.on("connection", async (ws, req) => {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  ws.userId = decoded.userId;

  const user = await User.findByPk(ws.userId);

  ws.on("message", async (data) => {
    const text = data.toString();

    const savedMsg = await Message.create({
      UserId: ws.userId,
      message: text
    });

    const payload = {
      userId: ws.userId,
      username: user.name,
      message: text,        
      createdAt: savedMsg.createdAt
    };

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  });
});


sequelize
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (HTTP + WebSocket)`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
