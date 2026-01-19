const express = require("express");
const cors = require("cors");
const sequelize = require('./utils/db-connection');
require("dotenv").config();

const User = require("./models/userModel");
const Message=require('./models/message')

const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

User.hasMany(Message);  
Message.belongsTo(User);

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
