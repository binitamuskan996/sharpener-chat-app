const express = require("express");
const cors = require("cors");
const sequelize = require('./utils/db-connection');
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
