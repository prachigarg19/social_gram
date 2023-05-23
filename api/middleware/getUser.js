const jwt = require("jsonwebtoken");

function getUser(req, res, next) {
  //getting token from header
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send("Invalid token");
    }

    const data = jwt.verify(token, "shhhhh");
    //data returned format->
    // {
    //     "user": {
    //       "id": "633ed45d81fdb1ec387cad10"
    //     },
    //     "iat": 1665061981
    //   }
    //req contains details, res is what we will send.Hence we assigned value to req
    req.userId = data.userId;
    next();
  } catch (err) {
    res.status(401).send(err);
  }
}

module.exports = getUser;
