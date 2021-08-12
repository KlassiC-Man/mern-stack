const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get the token!
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    res.status(401).json({ msg: "No token - authorization denied!" });
  } else {
    try {
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      req.user = decoded.user;
      next();
    } catch (e) {
      res.status(401).json({ msg: "Token is invalid" });
    }
  }
};
