const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Challenge Schema
const ChallengeSchema = new Schema(
  {
    title: String,
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: "tests",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Challenge = mongoose.model("challenges", ChallengeSchema);
