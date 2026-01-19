const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Message;
