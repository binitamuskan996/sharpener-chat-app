const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/file-upload"); 
const { upload_media } = require("../controllers/mediaController");

router.post("/upload", upload.single("file"), upload_media); 

module.exports = router;
