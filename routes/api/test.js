const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const status = require("http-status");
const Test = require("../../models/Test");
const passport = require("passport");
const User = require("../../models/User");

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

// @route   POST api/code/test
// @desc    post test route
// @access  Public
router.post(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const reqUser = req.user;
    if (reqUser.role === "admin") {
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
    } else {
      return res
        .status(status.UNAUTHORIZED)
        .json({ code: status.UNAUTHORIZED, msg: "unauthorized" });
    }
  }
);

// @route   DELETE api/code/question/:id/
// @desc    delete a question
// @access  Private
router.delete(
  "/test/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const reqUser = req.user;
    if (reqUser.role === "admin") {
      const id = req.params.id;
      Test.findByIdAndDelete(id)
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
    } else {
      return res
        .status(status.UNAUTHORIZED)
        .json({ code: status.UNAUTHORIZED, msg: "unauthorized" });
    }
  }
);

// @route   POST api/v1/cheaterrank/test/submit
// @desc    submit code
// @access  Private
router.post(
  "/test/submit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { userId, testId, code, userName } = req.body;

    Test.findById(testId)
      .then((test) => {
        Test.findOneAndUpdate(
          {
            _id: testId,
            submitted_users: { $elemMatch: { userId } },
          },
          {
            $set: {
              "submitted_users.$.userName": userName,
              "submitted_users.$.code": code,
            },
          },
          { new: true, safe: true, upsert: true }
        )
          .then((test) =>
            res
              .status(status.CREATED)
              .json({ code: status.CREATED, data: test._doc })
          )
          .catch((err) => {
            test.submitted_users.push({ userId, code });
            test
              .save()
              .then((data) =>
                res
                  .status(status.CREATED)
                  .json({ code: status.CREATED, data: data._doc })
              );
          });
      })
      .catch((err) =>
        res.status(status.NOT_FOUND).json({ msg: "User is not found" })
      );
  }
);

// router.delete("/test/delete/all", (req, res) => {
//   Test.remove({}).then((data) => res.json({ msg: "deleted all" }));
// });

module.exports = router;
