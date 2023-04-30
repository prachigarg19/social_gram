const express = require("express");
const router = express.Router();
const User = require("../models/Users");

//UPDATE USER
router.put("/:id", async (req, res) => {
  //if user matches
  if (req.body.id === req.params.id || req.body.isAdmin) {
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

//DELETE A USER

router.delete("/:id", async (req, res) => {
  //if user matches
  if (req.body.id === req.params.id || req.body.isAdmin) {
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

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //eliminating unneccesary stuff like password. doc contains our object
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e);
  }
});
//FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      //id of the user to follow
      const user = await User.findById(req.params.id);
      //id of the current user
      const currentUser = await User.findById(req.body.id);
      //check if current user is not aready follwing
      if (!user.followers.includes(req.body.id)) {
        //update follower array of user
        await User.findByIdAndUpdate(req.params.id, {
          $push: { followers: req.body.id },
        });
        //update follow array of current user
        await User.findByIdAndUpdate(req.body.id, {
          $push: { following: req.params.id },
        });
        res.status(200).send("The follow request was successful");
      } else {
        res.status(403).send("You already follow the user");
      }
    } catch (e) {
      console.log(e);
    }
  }
});

//UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      //id of the user to follow
      const user = await User.findById(req.params.id);
      //id of the current user
      const currentUser = await User.findById(req.body.id);
      //check if current user is not aready follwing
      if (user.followers.includes(req.body.id)) {
        //update follower array of user
        await User.findByIdAndUpdate(req.params.id, {
          $pull: { followers: req.body.id },
        });
        //update follow array of current user
        await User.findByIdAndUpdate(req.body.id, {
          $pull: { following: req.params.id },
        });
        res.status(200).send("The unfollow request was successful");
      } else {
        res.status(403).send("You already don't follow the user");
      }
    } catch (e) {
      console.log(e);
    }
  }
});

module.exports = router;
