const express = require('express')
const router = express.Router()
const Like = require('../models/Like')
const Post = require('../models/tiktok')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1108043",
    key: "157b2bf9de51a6067ac9",
    secret: "33db52881b6eef9f3c5c",
    cluster: "ap2",
    useTLS: true
});

//@route  POST /likes/likePost
//@description //like a post
//@acccess  Private
router.post('/likePost', (req, res) => {
    //before u like an post we have to ensure u havent liked it before
    Like.findOne({ userId: req.body.userId, postId: req.body.userId })
        .then(like => {
            console.log(like)
            if (!like) {
                
                //post request is to add data to the database
                //it will let us add a notifiaction doc to the database
                Like.create(req.body)
                    .then(data => {
                        Post.findByIdAndUpdate({ _id: req.body.postId }, { $inc: { likes: 1 } })
                            .then(post => {
                                pusher.trigger("like", "created", {
                                    data
                                })
                                res.status(200).json({
                                    msg: 'Post count increased',
                                    data
                                })
                            })
                    })
                    .catch(err => {
                        res.status(500).send(err)
                    })

            } else {
                res.status(422).json({ err: 'You already liked this post' })
            }
        })


})

//@route  POST /likes/unlikePost
//@description //unlike a post
//@acccess  Private
router.delete('/unlikePost/:id', (req, res) => {
    console.log(req.body);
    //post request is to add data to the database
    Like.deleteOne({ _id: req.params.id })
        .then(data => {
            Post.findByIdAndUpdate({ _id: req.body.postId }, { $inc: { likes: -1 } })
                .then(post => {
                    pusher.trigger("like", "deleted", {
                        data
                    })
                    res.status(200).json({ msg: 'Post count reduced' })
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})

//@route  GET /likes
//@description //get all likes
//@acccess  Private
router.get('/', (req, res) => {
    Like.find({})
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})
















module.exports = router