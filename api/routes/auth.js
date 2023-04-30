//create and logging user
const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

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
    const savedUser = await user.save(); //saves in database
    res.status(200).json(savedUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

//LOGIN
router.get("/login", async (req, res) => {
  //ask user for email and password
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(404).send("Incorrect username");
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
    res.status(200).json(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
