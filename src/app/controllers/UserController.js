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
    async getuser(req, res) {
        const user = await User.findById(req.params.id)

        return res.json(user);
    }
    async update(req, res) {

        if (req.body.id !== req.userId) return res.status(400).json({ error: "Invalid token" })
        const { name, email, description, password } = req.body;
        if (await User.findOne({
            email
        })) {
            return res.status(400).json({
                error: 'Email already exists'
            })
        }
        const userInfo = {
            name,
            email,
            description,
            password
        }

        const user = await User.findByIdAndUpdate(req.body.id, userInfo, {
            new: true
        })

        //console.log(user)
        return res.json(user);
    }
    async deleteall(req, res) {
        await User.deleteMany();

        return res.send();
    }
}
module.exports = new UserController();