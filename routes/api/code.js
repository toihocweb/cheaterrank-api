const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const status = require("http-status");
const Question = require("../../models/Question");
const User = require("../../models/User");
const passport = require("passport");
const isAuth = require("../../config/isAuth");
const isAdmin = require("../../config/isAdmin");
// @route   GET api/code/test
// @desc    test code route
// @access  Public
router.get("/test", isAuth, (req, res) => {
  res.status(status.OK).json({ code: status.OK, msg: "Code Works" });
});

// @route   GET api/code/question
// @desc    get all questions route
// @access  Public
router.get("/question", (req, res) => {
  Question.find()
    .sort({ _id: 1 })
    .then((rs) => {
      if (!rs) {
        return res
          .status(status.NOT_FOUND)
          .json({ code: status.NOT_FOUND, msg: "Not Found" });
      }
      res.json(rs);
    })
    .catch((error) => {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        code: status.INTERNAL_SERVER_ERROR,
        msg: "can not get questions",
      });
    });
});

// @route   GET api/code/question/:id
// @desc    get detail question route
// @access  Public
router.get("/question/:id", (req, res) => {
  Question.findById(req.params.id)
    .then((rs) => {
      if (!rs) {
        return res
          .status(status.NOT_FOUND)
          .json({ code: status.NOT_FOUND, msg: "Not Found" });
      }
      res.status(status.OK).json(rs.submited_codes);
    })
    .catch((error) => {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        code: status.INTERNAL_SERVER_ERROR,
        msg: "can not get question",
      });
    });
});

// @route   POST api/code/question
// @desc    post questions route
// @access  Public
router.post("/question", isAdmin, (req, res) => {
  const qs = new Question({
    qs_name: "",
    qs_content: req.body.qs_content,
    submited_codes: [],
  });
  qs.save()
    .then((rs) => {
      if (!res) {
        return res
          .status(status.BAD_REQUEST)
          .json({ code: status.BAD_REQUEST, msg: "Error when posting" });
      }
      res.status(status.CREATED).json(rs);
    })
    .catch((error) => {
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json({ code: status.INTERNAL_SERVER_ERROR, msg: "cant not post" });
    });
});
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// @route   POST api/code/question/:id
// @desc    submit code for question id route
// @access  Public
router.post("/question/:id", isAuth, submitLimiter, (req, res) => {
  const id = req.params.id;
  Question.findById(id).then((rs) => {
    if (!rs) {
      return res
        .status(status.NOT_FOUND)
        .json({ code: status.NOT_FOUND, msg: "can not submit code" });
    }
    const submited_codes = rs.submited_codes;
    submited_codes.push({
      name: req.body.name,
      code: req.body.code,
    });
    console.log("posted");
    Question.findOneAndUpdate(
      { _id: id },
      { $set: { submited_codes: submited_codes } },
      { new: true }
    )
      .then((result) => {
        if (!result) {
          return res.status(status.BAD_REQUEST).json({
            code: status.BAD_REQUEST,
            msg: "have some errors when update",
          });
        }
        res
          .status(status.OK)
          .json({ code: status.OK, msg: "Submit successfully!" });
      })
      .catch((error) => {
        return res
          .status(status.NOT_FOUND)
          .json({ code: status.NOT_FOUND, msg: "Question is not found" });
      });
  });
});

// @route   DELETE api/code/question/:id/:codeid
// @desc    delete submitted codeid route
// @access  Private
router.delete("/question/:id/:codeid", isAdmin, (req, res) => {
  const id = req.params.id;
  const codeid = req.params.codeid;
  Question.findById(id)
    .then((rs) => {
      if (!rs) {
        return res
          .status(status.NOT_FOUND)
          .json({ code: status.NOT_FOUND, msg: "question can not found" });
      }
      const submited_codes = rs.submited_codes;
      console.log(submited_codes);
      const newCodes = submited_codes.filter(
        (val) => val._id.toString() !== codeid
      );
      console.log("deleted");
      Question.findOneAndUpdate(
        { _id: id },
        { $set: { submited_codes: newCodes } },
        { new: true }
      )
        .then((result) => {
          if (!result) {
            return res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "have some errors when update",
            });
          }
          console.log(result);
          res
            .status(status.OK)
            .json({ code: status.OK, msg: "Deleted successfully!" });
        })
        .catch((error) => {
          return res
            .status(status.BAD_REQUEST)
            .json({ code: status.BAD_REQUEST, msg: "can not delete" });
        });
    })
    .catch((error) => {
      return res
        .status(status.NOT_FOUND)
        .json({ code: status.NOT_FOUND, msg: "question can not found" });
    });
});

// @route   DELETE api/code/question/:id/
// @desc    delete a question
// @access  Private
router.delete("/question/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  Question.findByIdAndDelete(id)
    .then((rs) => {
      if (!rs) {
        return res
          .status(status.NOT_FOUND)
          .json({ code: status.NOT_FOUND, msg: "question can not found" });
      }
      return res.status(status.OK).json(rs);
    })
    .catch((error) => {
      return res
        .status(status.NOT_FOUND)
        .json({ code: status.NOT_FOUND, msg: "question can not found" });
    });
});

// @route   POST api/code/question/like/:id
// @desc    like an anwser
// @access  Private
router.get(
  "/question/like/:id/:aid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then((profile) => {
      Question.findById(req.params.id)
        .then((post) => {
          const findedAnwser = post.submited_codes.filter(
            (ans) => ans._id.toString() === req.params.aid
          );
          if (!findedAnwser.length) {
            return res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "can not like this post",
            });
          }
          if (
            findedAnwser[0].likes.filter(
              (like) => like.user.toString() === req.user.id
            ).length > 0
          ) {
            return res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "User already liked this post",
            });
          }
          findedAnwser[0].likes.unshift({ user: req.user.id });
          // post = [...post]
          // post.save().then((post) => res.json(post));
          Question.findByIdAndUpdate(req.params.id, post).then((post) =>
            res.json(post)
          );
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

module.exports = router;
