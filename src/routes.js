const express = require('express');
const multer = require('multer');
const uploadConfig = require('./app/config/upload');
const PostController = require('./app/controllers/PostController')
const LikeController = require('./app/controllers/LikeController')
const UserController = require('./app/controllers/UserController')

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.get('/user', UserController.index);
routes.post('/user', upload.single('avatar'), UserController.store);

routes.get('/posts', PostController.index);
routes.post('/posts', upload.single('image'), PostController.store);

routes.post('/posts/:id/like', LikeController.store)

module.exports = routes;