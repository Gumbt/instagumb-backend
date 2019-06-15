const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class PostController {
    async index(req, res) {
        const posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 20,
            populate: ['author'],
            sort: '-createdAt'
        });

        return res.json(posts);
    }

    async store(req, res) {
        const { place, description, hashtags } = req.body;
        const { filename: image } = req.file;
        const author = req.userId;
        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', 'posts', fileName)
            );

        fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName
        })
        const postComplete = await Post.findById({
            _id: post._id
        }).populate('author');

        req.io.emit('post', postComplete);

        return res.json(postComplete);
    }
    async update(req, res) {
        const post = await Post.findByIdAndUpdate(req.body.id, req.body, {
            new: true
        })

        return res.json(post);
    }
    async destroy(req, res) {
        await Post.findByIdAndDelete(req.params.id)

        return res.send();
    }
    async deleteall(req, res) {
        await Post.deleteMany();

        return res.send();
    }
}
module.exports = new PostController();