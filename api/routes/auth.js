//create and logging user
const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getUser = require("../middleware/getUser");

//REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const userExist = await User.findOne({ email: req.body.email });

    //extracting from req
    if (!userExist) {
      const user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      //is user can be saved i.e. valid
      const savedUser = await user.save(); //saves in database // Generate JWT token
      const token = jwt.sign({ userId: user._id }, "shhhhh");

      // Send token and user information in the response
      res.status(200).json({ token, savedUser });
    } else {
      res.status(409).json({
        message: "user exist",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "internal server error",
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //ask user for email and password
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "Incorrect credentials" });
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user._id }, "shhhhh");

    // Send token and user information in the response
    res.status(200).json({ token, user });
  } catch (e) {
    console.log(e);
    res.status(500).json({message:"internal server error"});
  }
});

//get user from token
router.get("/user", getUser, async (req, res) => {
  try {
    // Retrieve the user information based on the userId from the token
    const user = await User.findById(req.userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
