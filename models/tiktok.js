const mongoose = require("mongoose");
const tiktokSchema = mongoose.Schema(
  {
    url: String,
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: String,
    song: String,
    likes: {
      type: Number,
      default: 0,
    },
    messages: {
      type: Number,
      default: 0,
    },
    description: String,
    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("tiktok", tiktokSchema);
