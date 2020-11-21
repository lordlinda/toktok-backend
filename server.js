//import modules
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()

//initialise app
const app = express()
//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log(err))


//api routes
app.get('/v1/posts', (req, res) => {
    res.send('hello world')
})

app.use('/posts', require('./routes/Post.js'))
app.use('/users', require('./routes/User.js'))
app.use('/notifications', require('./routes/Notifications'))
app.use('/likes', require('./routes/Likes'))
app.use('/comments', require('./routes/Comments.js'))
app.use('/shares', require('./routes/Shares'))



//listen to app
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))