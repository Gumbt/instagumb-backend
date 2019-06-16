const Post = require('../models/Post');
const Like = require('../models/Like');

class LikeController {
    async index(req, res) {
        const postsLiked = await Like.find({ userid: req.userId }).sort('-createdAt');

        return res.json(postsLiked);
    }
    async store(req, res) {
        const postid = req.params.id;
        const userid = req.userId;
        const post = await Post.findById(postid).populate('author');
        const verificaLike = await Like.findOne({
            userid,
            postid
        })
        //console.log(verificaLike)
        if (verificaLike == null || verificaLike.length == 0) {
            await Like.create({
                userid,
                postid
            })
            post.likes += 1;

            await post.save();

            req.io.emit('like', post);

            return res.json({ like: true });
        } else {
            await Like.findByIdAndDelete(verificaLike._id)
            post.likes -= 1;

            await post.save();

            req.io.emit('like', post);
            return res.json({ like: false });
        }
    }
};
module.exports = new LikeController();