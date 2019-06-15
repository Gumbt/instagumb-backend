const mongoose = require('mongoose');

const Like = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },

}, {
        timestamps: true
    })
module.exports = mongoose.model('Like', Like)