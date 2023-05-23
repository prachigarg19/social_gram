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
    //extracting from req
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
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //ask user for email and password
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send("Incorrect email");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(404).send("Invalid Password");
      return;
    }
    const token = jwt.sign({ userId: user._id }, "shhhhh");

    // Send token and user information in the response
    res.status(200).json({ token, user });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
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
