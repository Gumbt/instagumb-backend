const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class UserController {
    async index(req, res) {
        const users = await User.find().sort('-createdAt');

        return res.json(users);
    }
    async store(req, res) {

        const { name, email, description, password } = req.body;

        const { filename: avatar } = req.file;

        if (await User.findOne({
            email
        })) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                error: 'User already exists'
            })
        }


        const [nameim] = avatar.split('.');
        const fileName = `${nameim}.jpg`;

        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', 'avatar', fileName)
            );

        fs.unlinkSync(req.file.path);

        const user = {
            name,
            email,
            description,
            password,
            avatar
        }
        const re = await User.create(user);

        return res.json(re);
    }
    async update(req, res) {
        console.log(req.body)
        const user = await User.findByIdAndUpdate(req.body.id, req.body, {
            new: true
        })

        return res.json(user);
    }
}
module.exports = new UserController();