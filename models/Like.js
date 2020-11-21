const mongoose = require('mongoose')
const likeSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tiktok'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


})
module.exports = mongoose.model('like', likeSchema)