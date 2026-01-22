const { upload, s3 } = require("../middleware/file-upload");
require("dotenv").config();

const upload_media = async (req, res) => {
  try {
    const { v4: uuid } = await import("uuid");
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file" });

    const key = `chat-media/${uuid()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const result = await s3.upload(params).promise();

    const url = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60 
    });

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { upload_media };
