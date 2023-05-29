const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

//to get image from firebase
//prevent cors error
router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const bucket = admin.storage().bucket();
    const file = bucket.file("uploads/" + filename);
    const stream = file.createReadStream();

    // Set the appropriate CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");

    // Pipe the image stream back to the response
    stream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image.");
  }
});

module.exports = router;
