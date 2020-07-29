const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const status = require("http-status");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, keys.secretOrKey);
    console.log(decodedToken);
    if (decodedToken.role === "admin") {
      next();
    } else {
      res.status(status.UNAUTHORIZED).json({
        code: status.UNAUTHORIZED,
        msg: "Invalid Token",
      });
    }
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({
      code: status.UNAUTHORIZED,
      msg: "Invalid Token",
    });
  }
};
