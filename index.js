require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./utils/db-connection");
const User = require("./models/userModel");
const Message = require("./models/message");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const ArchivedMessage = require("./models/archivedmsgModel");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/media", mediaRoutes);

require("./controllers/archivedmsg");


User.hasMany(Message);
Message.belongsTo(User);

const server = http.createServer(app);

const initializeSocket = require("./socket_io/index");
const { default: nodeCron } = require("node-cron");
const io = initializeSocket(server);

sequelize
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });