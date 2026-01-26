const cron = require("node-cron");
const { Op } = require("sequelize");
const Message = require("../models/message");
const ArchivedMessage = require("../models/archivedmsgModel");

cron.schedule("* * * * *", async () => {
  console.log("Running archive job");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    const oldMessages = await Message.findAll({
      where: { createdAt: { [Op.lt]: yesterday } }
    });

    if (!oldMessages.length) return;

    await ArchivedMessage.bulkCreate(
      oldMessages.map(m => ({
        message: m.message,
        UserId: m.UserId,
        createdAt: m.createdAt
      }))
    );

    await Message.destroy({
      where: { id: oldMessages.map(m => m.id) }
    });

    console.log(`Archived ${oldMessages.length} messages`);
  } catch (err) {
    console.error("Cron failed", err);
  }
});
