const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tiktok",
    },
    username: String,
    userProfile: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
