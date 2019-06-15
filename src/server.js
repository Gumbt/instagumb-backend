require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Youch = require('youch');
//const server = require('http').Server(express());
//const io = require('socket.io')(server);
const validate = require('express-validation');

class App {
    constructor() {
        this.express = express();
        this.isDev = process.env.NODE_ENV != 'production';
        this.express.use(cors());
        this.server = require('http').Server(this.express);
        this.io = require('socket.io')(this.server);

        this.database();
        this.socket();
        this.middlewares();
        this.routes();
        this.exception();
    }
    database() {
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true
        });
    }
    socket() {
        this.express.use((req, res, next) => {
            req.io = this.io;
            next();
        });
    }
    middlewares() {
        this.express.use(express.json());
        this.express.use('/files/posts', express.static(path.resolve(__dirname, '..', 'uploads', 'resized', 'posts')));
        this.express.use('/files/avatar', express.static(path.resolve(__dirname, '..', 'uploads', 'resized', 'avatar')));
    }
    routes() {
        this.express.use(require('./routes'));
    }
    exception() {
        if (process.env.NODE_ENV == 'production') {
            this.express.use(Sentry.Handlers.errorHandler())
        }
        this.express.use(async (err, req, res, next) => {
            if (err instanceof validate.ValidationError) {
                return res.status(err.status).json(err);
            }

            if (process.env.NODE_ENV != 'production') {
                const youch = new Youch(err, req)

                return res.json(await youch.toJSON())
            }

            return res.status(err.status || 500).json({
                error: 'Internal Server Error'
            })
        })
    }
}

module.exports = new App().server