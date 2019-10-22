const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const ExpressBrute = require('express-brute');
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, 10);

    let user = new User({
        email: email,
        password: password
    });

    user.save((err, user) => {
        if (err) return next(err);
        res.status(200).json({
            message: 'Successfully signed up'
        });
    });
});

router.post('/signin', bruteforce.prevent, (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return next(err);

        if (!user) {
            return res.status(401).json({
                message: 'Not aunthenticated'
            });
        }

        if (!bcrypt.compare(req.body.password, user.password)) {
            return res.status(501).json({
                message: 'Wrong credentials'
            });
        }

        let token = jwt.sign({email: user.email, id: user._id}, config.secret, {expiresIn: '1h'});
        res.status(200).json({
            token: token,
            expiresIn: 3600000,
            id: user._id
        });
    });
});

router.post('/signout', (req, res, next) => {
    res.status(200).json({
        token: null
    });
});

router.get('/checkToken', (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                res.status(200).json({
                    success: true,
                    token: token
                });
            }
        });
    }
});

module.exports = router;
