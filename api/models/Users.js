const mongoose = require("mongoose");

//building user schema
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      //no same user names in database allowed
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "",
    },
    followers: {
      //keeping user id in the array
      type: Array,
      default: [],
    },
    following: {
      //keeping user id in the array
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    Relationship: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
