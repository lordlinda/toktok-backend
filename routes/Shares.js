const express = require('express')
const router = express.Router()
const Share = require('../models/Share')
const Post = require('../models/tiktok')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1108043",
    key: "157b2bf9de51a6067ac9",
    secret: "33db52881b6eef9f3c5c",
    cluster: "ap2",
    useTLS: true
});

//@route  POST /
//@description //share a post
//@acccess  Private
router.post('/', (req, res) => {
    //before u share a post we have to ensure u havent shared it before
    Share.findOne({ userId: req.body.userId, postId: req.body.userId })
        .then(share => {
            console.log(share);

            if (share) {
                //post request is to add data to the database
                //it will let us add a share doc to the database
                Share.create(req.body)
                    .then(data => {
                        Post.findByIdAndUpdate({ _id: req.body.postId }, { $inc: { shares: 1 } })
                            .then(post => {
                                pusher.trigger("share", "created", {
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



//@route  GET /shares
//@description //get all posts shared by user
//@acccess  Private
router.get('/:id', (req, res) => {
    Share.find({ userId: req.params.id })
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})
















module.exports = router