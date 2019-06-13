const express = require('express');
const multer = require('multer');
const uploadConfig = require('./app/config/upload');
const controllers = require('./app/controllers')

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.get('/user', controllers.UserController.index);
routes.post('/user', upload.single('avatar'), controllers.UserController.store);

routes.get('/posts', controllers.PostController.index);
routes.post('/posts', upload.single('image'), controllers.PostController.store);
routes.delete('/posts/:id', controllers.PostController.destroy)

routes.post('/posts/:id/like', controllers.LikeController.store)

module.exports = routes;