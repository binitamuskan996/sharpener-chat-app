const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

  const ArchivedMessage = sequelize.define("ArchivedMessage", {
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: DataTypes.DATE
  });

module.exports = ArchivedMessage;
