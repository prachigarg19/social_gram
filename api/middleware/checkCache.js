const cache = require("memory-cache");

const checkCache = (req, res, next) => {
  const cachedPosts = cache.get(req.params.id);
  if (cachedPosts) {
    console.log("***CACHED DATA****");
    res.status(200).json(cachedPosts);
  } else {
    next();
  }
};

module.exports = checkCache;
