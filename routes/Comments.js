const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/tiktok");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1108043",
  key: "157b2bf9de51a6067ac9",
  secret: "33db52881b6eef9f3c5c",
  cluster: "ap2",
  useTLS: true,
});

//@route  POST /comments
//@description //comment on  a post
//@acccess  Private
router.post("/", (req, res) => {
  //post request is to add data to the database
  //it will let us add a comment doc to the database
  Comment.create(req.body)
    .then((data) => {
      Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $inc: { messages: 1 } }
      ).then((post) => {
        pusher.trigger("comment", "created", {
          data: req.body,
        });
        res.status(200).json({ msg: "Post count increased", data });
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//@route  GET /comments
//@description //get all comments
//@acccess  Private
router.get("/", (req, res) => {
  Comment.find({})
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
