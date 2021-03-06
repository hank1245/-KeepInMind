const mongoose = require("mongoose");

const goalScehma = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Please Add a text value"],
    },
    content: {
      type: String,
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isTrash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Goal", goalScehma);
