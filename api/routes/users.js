const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const getUser = require("../middleware/getUser");
const multer = require("multer");
const upload = multer({ dest: "temp/" });
const admin = require("firebase-admin");
const fs = require("fs");

//UPDATE USER
router.put("/:id", getUser, async (req, res) => {
  //if user matches
  if (req.userId === req.params.id || req.body.isAdmin) {
    //update password
    if (req.body.password) {
      try {
        //encode password
        const salt = bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (e) {
        return res.status(500);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send("account has been updated");
    } catch (e) {
      console.log(e);
    }
  }
});

//CHANGE PHOTO
router.put("/upload/:type/:id", upload.single("img"), async (req, res) => {
  if (!req.body.isAdmin) return res.status(500).send("Not authorised");
  try {
    const file = req.file; // Get the uploaded file from the request

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const bucket = admin.storage().bucket();
    const uploadOptions = {
      destination: "uploads/" + file.originalname,
      metadata: {
        contentType: file.mimetype,
      },
    };

    bucket.upload(file.path, uploadOptions, async (err, uploadedFile) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json("Error uploading file.");
      }

      // Get the public URL of the uploaded file
      const fileUrl = uploadedFile.publicUrl();
      let updateField;
      if (req.params.type === "profilePic") {
        updateField = "profilePic";
      } else if (req.params.type === "coverPic") {
        updateField = "coverPic";
      } else {
        return res.status(400).send("Invalid upload type.");
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: { [updateField]: fileUrl },
        });
        return res.status(200).send("account has been updated");
      } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json("Post not created");
      } finally {
        // Cleanup the temporary file after processing
        fs.unlinkSync(file.path);
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json("Error uploading file.");
  }
});
//DELETE A USER

router.delete("/:id", getUser, async (req, res) => {
  //if user matches
  if (req.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).send("account has been deleted");
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).send("You can only delete your account");
  }
});

//GET A USER

router.get("/", async (req, res) => {
  //userId=something will execute this
  const userId = req.query.userId;
  //username=something will execute this
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    //eliminating unneccesary stuff like password. doc contains our object
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e);
  }
});

//FETCH FOLLOWINGS
router.get("/friends", getUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // if (!user) {
    //   // User not found
    //   res.status(404).json({ message: "User not found" });
    //   return;
    // }
    const friends = await Promise.all(
      user.following.map((followerId) => {
        return User.findById(followerId);
      })
    );
    const allFriends = [];
    friends.map((friend) => {
      const { _id, username, profilePic } = friend;
      allFriends.push({ _id, username, profilePic });
    });
    res.status(200).json(allFriends);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//FOLLOW A USER
router.put("/:id/follow", getUser, async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      //id of the user to follow
      const user = await User.findById(req.params.id);
      //id of the current user
      const currentUser = await User.findById(req.userId);
      //check if current user is not aready follwing
      if (!user.followers.includes(req.userId)) {
        //update follower array of user
        await User.findByIdAndUpdate(req.params.id, {
          $push: { followers: req.userId },
        });
        //update follow array of current user
        await User.findByIdAndUpdate(req.userId, {
          $push: { following: req.params.id },
        });
        res.status(200).json("The follow request was successful");
      } else {
        res.status(403).json("You already follow the user");
      }
    } catch (e) {
      console.log(e);
    }
  }
});

//UNFOLLOW A USER
router.put("/:id/unfollow", getUser, async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      //id of the user to follow
      const user = await User.findById(req.params.id);
      //id of the current user
      const currentUser = await User.findById(req.userId);
      //check if current user is not aready follwing
      if (user.followers.includes(req.userId)) {
        //update follower array of user
        await User.findByIdAndUpdate(req.params.id, {
          $pull: { followers: req.userId },
        });
        //update follow array of current user
        await User.findByIdAndUpdate(req.userId, {
          $pull: { following: req.params.id },
        });
        res.status(200).json("The unfollow request was successful");
      } else {
        res.status(403).json("You already don't follow the user");
      }
    } catch (e) {
      console.log(e);
    }
  }
});

module.exports = router;
