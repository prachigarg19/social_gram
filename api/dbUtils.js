const Post = require("./models/Post");
const User = require("./models/Users");
//aggregates user and post
async function fetchProjectData(id) {
  try {
    const posts = await Post.aggregate([
      //finds Post with userId= id passed as parameter
      {
        $match: {
          userId: id.toString(),
        },
      },
      //finds users where userId in post matches the _id
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$userId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                _id: 0,
                username: 1,
                profilePic: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      //creates a new project object which combines username and profilePic from user and post fields
      {
        $project: {
          _id: 1,
          userId: 1,
          img: 1,
          likes: 1,
          desc: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            username: 1,
            profilePic: 1,
          },
        },
      },
    ]);
    return posts;
  } catch (error) {
    console.log("Error fetching project data:", error);
    throw new Error("Error fetching project data");
  }
}

module.exports = {
  fetchProjectData,
};
