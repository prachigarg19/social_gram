const mongoose = require("mongoose");

//building user schema
const PostSchema = mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  img: {
    type: String,
    default: "",
  },
  likes: {
    //keeping user id in the array
    type: Array,
    default: [],
  },
  desc: {
    type: String,
    max: 50,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model("Post", PostSchema);
