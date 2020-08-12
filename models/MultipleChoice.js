const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// MultipleChoice Schema
const MultipleChoiceSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [String],
  submitted_users: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      anwser: [Number],
    },
  ],
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = MultipleChoice = mongoose.model(
  "MultipleChoices",
  MultipleChoiceSchema
);
