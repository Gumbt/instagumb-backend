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
        console.log(req.body);
        console.log(req.file);
        const { name, email, description, password } = req.body;

        const { filename: avatar } = req.file;

        if (await User.findOne({
            email
        })) {
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
                path.resolve(req.file.destination, 'resized', fileName)
            );

        fs.unlinkSync(req.file.path);

        const user = {
            name,
            email,
            description,
            password,
            avatar
        }
        console.log(user);
        const re = await User.create(user);

        return res.json(re);
    }
}
module.exports = new UserController();