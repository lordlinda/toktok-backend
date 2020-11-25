const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    username: String,
    bio: String,
    website: String,
    phoneNumber: String,
    profilePic: String,
    following: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
