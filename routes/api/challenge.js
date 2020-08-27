const express = require("express");
const router = express.Router();
const status = require("http-status");
const Challenge = require("../../models/Challenge");
// @route   GET api/cheaterrank/challenge/test
// @desc    test route
// @access  Public
router.get("/test", (req, res) => {
  return res.status(status.OK).json({ code: status.OK, msg: "Code Works" });
});

// @route   GET api/cheaterrank/challenge/:id
// @desc    get challenge by id
// @access  Public
router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
});

// @route   GET api/cheaterrank/challenge
// @desc    get all cl
// @access  Public
router.get("/", (req, res) => {
  Challenge.find({})
    .populate({
      path: "tests",
      select: "-submitted_users",
    })
    .then((cl) => res.json(cl));
});

// @route   POST api/cheaterrank/challenge
// @desc    create new challenge
// @access  Public
router.post("/", (req, res) => {
  const { title } = req.body;
  const newChallenge = new Challenge({
    title,
    tests: [],
  });
  newChallenge.save().then((cl) => res.status(status.CREATED).json(cl));
});

// @route   POST api/cheaterrank/challenge/add/:id
// @desc    add new test to challenge
// @access  Public
router.post("/add/:id", (req, res) => {
  const { testId } = req.body;
  const { id } = req.params;
  Challenge.findById(id).then((cl) => {
    if (cl) {
      if (cl.tests.includes(testId)) {
        return res
          .status(status.BAD_REQUEST)
          .json({ code: status.BAD_REQUEST, msg: "Already Exist!" });
      } else {
      }
    } else {
      return res
        .status(status.NOT_FOUND)
        .json({ code: status.NOT_FOUND, msg: "Not Found Challenge" });
    }
  });
});
module.exports = router;
