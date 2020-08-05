const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const User = require("../../models/User");
const status = require("http-status");
const validateRegister = require("../../validation/register");
const validateLogin = require("../../validation/login");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// @route   GET api/user/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.status(status.OK).json({ code: status.OK, msg: "Code Works" })
);

// @route   GET api/user/test
// @desc    Tests users route
// @access  Public
router.get("/users", (req, res) => {
  User.find({}).then((user) => res.json(user));
});

// @route   POST api/auth/register
// @desc    register a user route
// @access  Public
router.post("/register", (req, res) => {
  const { isValid, errors } = validateRegister(req.body);
  if (!isValid) {
    return res
      .status(status.BAD_REQUEST)
      .json({ ...errors, code: status.BAD_REQUEST });
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.msg = "Email already exists";
      errors.field = "email";
      return res
        .status(status.BAD_REQUEST)
        .json({ ...errors, code: status.BAD_REQUEST });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(12, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const { _id: id, name, avatar, role } = user;
              return res
                .status(status.CREATED)
                .json({ id, name, avatar, role });
            })
            .catch((err) =>
              res.status(status.INTERNAL_SERVER_ERROR).json({
                code: status.INTERNAL_SERVER_ERROR,
                msg: "something wrong when create password",
              })
            );
        });
      });
    }
  });
});

// @route   POST api/auth/login
// @desc    login  route
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res
      .status(status.BAD_REQUEST)
      .json({ ...errors, code: status.BAD_REQUEST });
  }

  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.msg = "User not found";
      errors.field = "email";
      return res
        .status(status.NOT_FOUND)
        .json({ ...errors, code: status.NOT_FOUND });
    }
    // check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 20000,
          },
          (error, token) => {
            return res
              .status(status.OK)
              .json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        return res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Password is incorrect",
          field: "password",
        });
      }
    });
  });
});

// @route   GET api/auth/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
