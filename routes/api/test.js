const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const status = require("http-status");
const Test = require("../../models/Test");

// @route   GET api/cheaterrank/test
// @desc    test route
// @access  Public
router.get("/test", (req, res) => {
  return res.status(status.OK).json({ code: status.OK, msg: "Code Works" });
});

// @route   GET api/cheaterrank/tests
// @desc    get all tests
// @access  Public
router.get("/tests", (req, res) => {
  Test.find()
    .sort({ _id: 1 })
    .then((rs) => {
      if (!rs) {
        return res
          .status(status.NOT_FOUND)
          .json({ code: status.NOT_FOUND, msg: "Not Found" });
      }
      return res.json(rs);
    })
    .catch((error) => {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        code: status.INTERNAL_SERVER_ERROR,
        msg: "can not get questions",
      });
    });
});

// @route   POST api/code/question
// @desc    post questions route
// @access  Public
router.post("/test", (req, res) => {
  const { language, desc, inputs, outputs } = req.body;
  const test = new Test({
    language,
    desc,
    inputs,
    outputs,
  });
  test
    .save()
    .then((rs) => {
      if (!res) {
        return res
          .status(status.BAD_REQUEST)
          .json({ code: status.BAD_REQUEST, msg: "Error when posting" });
      }
      return res.status(status.CREATED).json(rs);
    })
    .catch((error) => {
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ code: status.INTERNAL_SERVER_ERROR, msg: error.message });
    });
});

module.exports = router;
