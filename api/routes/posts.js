const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/Users");
const getUser = require("../middleware/getUser");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const upload = multer({ dest: "temp/" });
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://socialgram-e1c8e.appspot.com",
});

router.post("/", upload.single("img"), async (req, res) => {
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

      try {
        const newPost = new Post({
          img: fileUrl, // Store the file URL in the 'img' field of the post
          desc: req.body.desc,
          userId: req.body.userId,
        });
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json("Post not created");
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

//update a post
router.put("/:id", getUser, async (req, res) => {
  //id = object id of post
  try {
    //find post from object id in parameter
    const post = await Post.findById(req.params.id);
    //check if user is the post creator
    if (post && post.userId === req.userId) {
      await post.updateOne({
        $set: req.body,
      });
      res.status(200).send("Your post has been updated");
    } else {
      res.status(403).send("You can only edit your posts");
    }
  } catch (e) {
    console.log(e);
  }
});

//LIKE POSTS
router.put("/:id/like", getUser, async (req, res) => {
  //id = object id of post
  //body contains user id of user liking the post
  try {
    //find post from object id in parameter
    const post = await Post.findById(req.params.id);
    //check if user is the post creator
    if (post && !post.likes.includes(req.userId)) {
      await post.updateOne({
        $push: { likes: req.userId },
      });
      res.status(200).json("The post has been Liked");
    } else {
      await post.updateOne({
        $pull: { likes: req.userId },
      });
      res.status(200).json("The post has been unliked");
    }
  } catch (e) {
    console.log(e);
  }
});

//GET ALL TIMELINE POSTS
router.get("/timeline/:id", async (req, res) => {
  //issue with /timeline is that it will be confused with get /id taking timeline as the id. To avoid this change router to /timeline/all
  try {
    let allPosts = [];
    //find current user
    const user = await User.findById(req.params.id);
    const userPost = await Post.find({ userId: user._id });
    //to fetch everything inside map, use Promise.all
    const friendsPost = await Promise.all(
      user.following.map((followerId) => {
        return Post.find({ userId: followerId });
      })
    );
    allPosts.push(...userPost);
    // allPosts.push(...friendsPost);
    friendsPost.map((friend) => {
      friend.map((post) => allPosts.push(post));
    });
    res.status(200).json(allPosts);
  } catch (e) {
    console.log(e);
  }
});

//GET A POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
  }
});

//GET A USER'S POSTS
router.get("/profile/:username", async (req, res) => {
  try {
    //finding user id with username as parameter
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
