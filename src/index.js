const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-n4nnb.mongodb.net/ig?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use('/files', express.static(path.resolve(__dirname,'..','uploads','resized')));

app.use(require('./routes'));

app.listen(process.env.PORT || 3333);
