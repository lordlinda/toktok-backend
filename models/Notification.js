const mongoose = require('mongoose')
const notificationSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tiktok'
    },
    receipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: String,
    type: String,
    read: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
module.exports = mongoose.model('Notification', notificationSchema)