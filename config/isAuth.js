const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const status = require("http-status");
const CryptoJS = require("crypto-js");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, keys.secretOrKey);
    if (decodedToken) {
      next();
    }
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({
      code: status.UNAUTHORIZED,
      msg: "Invalid Token",
    });
  }
};
