const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/Users");
const getUser = require("../middleware/getUser");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const upload = multer({ dest: "temp/" });
const cache = require("memory-cache");
const checkCache = require("../middleware/checkCache");
const fs = require("fs");
const mongoose = require("mongoose");

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
// the middleware function checkCache checks if the posts for the given id are already cached.
//If so, it directly sends the cached posts in the response.
//Otherwise, it proceeds to fetch the posts and store them in the cache with a specified expiration time (e.g., 1 minute).
//Subsequent requests within the cache expiration period will be served from the cache without making new API calls.
router.get("/timeline/:id", async (req, res) => {
  //issue with /timeline is that it will be confused with get /id taking timeline as the id. To avoid this change router to /timeline/all
  try {
    let allPosts = [];
    //find current user
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // Handle invalid ObjectId value
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const page = req.query.page || 1; // Get the page number from the query parameter, default to 1
    const perPage = 5; // Number of posts per page

    const user = await User.findById(userId);
    const userPost = await Post.find({ userId: user._id });
    //to fetch everything inside map, use Promise.all
    const friendsPost = await Promise.all(
      user.following.map((followerId) => {
        return Post.find({ userId: followerId });
      })
    );
    allPosts.push(...userPost);
    userPost.map((post) => {
      allPosts.push(post);
    });
    // allPosts.push(...friendsPost);
    friendsPost.map((friend) => {
      friend.map((post) => allPosts.push(post));
    });
    // cache.put(req.params.id, allPosts, 60000);
    const startIndex = perPage * (page - 1); // Starting index for slicing posts
    const endIndex = perPage * page; // Ending index for slicing posts
    const slicedPosts = allPosts.slice(startIndex, endIndex);
    res.status(200).json(slicedPosts);
  } catch (e) {
    console.log(e);
  }
  // The page variable is obtained from the query parameter req.query.page. It represents the current page number and defaults to 1 if not provided.
  // The perPage variable is set to 5, which determines the number of posts to be returned per page.
  // The skip() method is used to skip the appropriate number of posts based on the current page number and perPage value.
  // The limit() method is used to limit the number of posts fetched per page to perPage.
  // The posts are sorted in descending order based on their createdAt field using the sort() method.
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
    const page = req.query.page || 1; // Get the page number from the query parameter, default to 1
    const perPage = 5; // Number of posts per page
    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.status(200).json(posts);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
