const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Test Schema
const TestSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  desc: {
    type: String,
    required: true,
  },
  inputs: {
    type: String,
    required: true,
  },
  outputs: {
    type: String,
    required: true,
  },
  submitted_users: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      code: {
        type: String,
        required: true,
      },
    },
  ],
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Test = mongoose.model("tests", TestSchema);
