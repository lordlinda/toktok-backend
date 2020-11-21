const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1108043",
    key: "157b2bf9de51a6067ac9",
    secret: "33db52881b6eef9f3c5c",
    cluster: "ap2",
    useTLS: true
});
//@route  POST /notifications
//@description //make a notification
//@acccess  Private

router.post('/', (req, res) => {
    console.log(req.body);
    //post request is to add data to the database
    //it will let us add a notifiaction doc to the database
    Notification.create(req.body)
        .then(data => {
            pusher.trigger("notification", "created", {
                data
            })
            res.status(201).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})

//@route  GET /notifications/:id
//@description //get all notifications
//@acccess  Private
router.get('/:id', (req, res) => {
    Notification.find({ receipient: req.params.id })
        .then(data => {

            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})

//@route  PATCH /notifications/:id
//@description //mark notification read
//@acccess  Private
router.patch('/:id', (req, res) => {
    //we update user details
    Notification.updateOne({ _id: req.params.id }, { read: true })
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})















module.exports = router