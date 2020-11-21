const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Follower = require('../models/Follower')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1108043",
    key: "157b2bf9de51a6067ac9",
    secret: "33db52881b6eef9f3c5c",
    cluster: "ap2",
    useTLS: true
});
//@route  POST /newUser
//@description //create a new user
//@acccess  Public

router.post('/newUser', (req, res) => {
    //before we create the user we have to ensure we dont have a user already with this email address
    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                //post request is to add data to the database
                //it will let us add a user doc to the database
                User.create(req.body)
                    .then(data => {
                        pusher.trigger("user", "created", {
                            data
                        })
                        console.log(data);

                        res.status(201).json({ msg: "user created successfully" })
                    })
                    .catch(err => {
                        res.status(500).send(err)
                    })
            } else {
                res.status(422).send({ err: "User already exists" })
            }
        })
})

//@route  GET /getUser/:id
//@description //get all user details
//@acccess  Public
router.get('/getUser/:id', (req, res) => {
    //post request is to add data to the database
    //it will let us add a video doc to the database
    User.findOne({ _id: req.params.id })
        .select('-password')
        .then(data => {
            res.status(200).json({ user: data })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})

//@route  GET /updateDetails/:id
//@description //update user details
//@acccess  Private
router.patch('/userDetails/:id', (req, res) => {
    //we update user details
    User.updateOne({ _id: req.params.id }, req.body, {
        new: true, upsert: true,
        rawResult: true
    })
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})


router.patch('/follow', (req, res) => {
    Follower.findOne({ userId: req.body.userId, followerId: req.body.followerId })
        .then(user => {
            console.log(user);
            if (!user) {

                Follower.create(req.body)
                    .then(data => {
                        pusher.trigger("user", "updated", {
                            data
                        })
                        User.updateOne({ _id: req.body.userId }, { $inc: { followers: 1 } })
                            .then(user => {
                                User.updateOne({ _id: req.body.followerId }, { $inc: { following: 1 } })
                                    .then(user => {
                                        res.status(200).json({ msg: "follow count increased" })

                                    })
                            })
                    })

            } else {
                res.status(422).send({ err: "You already follow this user" })
            }
        })

})

router.delete('/unfollow', (req, res) => {
    Follower.deleteOne({ userId: req.body.userId, followerId: req.body.followerId })
        .then(user => {
            pusher.trigger("user", "deleted", {
                data
            })
            User.updateOne({ _id: req.body.userId }, { $inc: { followers: -1 } })
                .then(user => {
                    User.updateOne({ _id: req.body.followerId }, { $inc: { following: -1 } })
                        .then(user => {
                            res.status(200).json({ msg: "follow count decreased" })
                        })
                })

        }).catch(err => {
            res.status(500).send(err)
        })

})

router.get('/followees/:id', (req, res) => {
    Follower.find({ followerId: req.params.id })
        .then(data => {
            res.status(200).json({ data })

        }).catch(err => {
            res.status(500).send(err)
        })
})












module.exports = router