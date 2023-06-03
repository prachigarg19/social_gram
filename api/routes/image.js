const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

//to get image from firebase
//prevent cors error
router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) res.status(404).json("File name is not valid");
    const bucket = admin.storage().bucket();
    const file = bucket.file("uploads/" + filename);
    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found");
    }
    const stream = file.createReadStream();

    // Set the appropriate CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");

    // Pipe the image stream back to the response
    stream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json("Error fetching image.");
  }
});

module.exports = router;
