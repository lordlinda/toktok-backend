const express = require('express')
const router = express.Router()
const Post = require('../models/tiktok')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1108043",
    key: "157b2bf9de51a6067ac9",
    secret: "33db52881b6eef9f3c5c",
    cluster: "ap2",
    useTLS: true
});
//@route  POST /posts
//@description //make a post
//@acccess  Private

router.post('/', (req, res) => {
    //post request is to add data to the database
    //it will let us add a video doc to the database
    Post.create(req.body)
        .then(data => {
            pusher.trigger("post", "created", {
                data
            })
            res.status(201).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})

//@route  GET /posts
//@description //get all posts
//@acccess  Private
router.get('/', (req, res) => {
    //post request is to add data to the database
    //it will let us add a video doc to the database
    Post.find({})
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})
















module.exports = router