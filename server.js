const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const treatmentRouter = require('./routes/treatment');

const server = express();

// mongoose configuration
mongoose.connect('mongodb://127.0.0.1:27017/gestor', { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.once('open', () => {
   console.log('Database connection established');
});

db.on('error', console.error.bind(console, 'connection error:'));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(express.static(path.join(__dirname, 'public')));

server.use(logger('dev'));
server.use(helmet());

server.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PATCH,PUT,POST,DELETE");
        return res.status(200).json({});
    }
    next();
});

server.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));


server.use('/', indexRouter);
server.use('/user', userRouter);
server.use('/treatment', treatmentRouter);

module.exports = server;
