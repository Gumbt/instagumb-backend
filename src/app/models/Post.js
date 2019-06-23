const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')

const Post = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    place: String,
    description: String,
    hashtags: String,
    image: String,
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
}, {
        timestamps: true
    }
);

Post.plugin(mongoosePaginate);
module.exports = mongoose.model('Post', Post);