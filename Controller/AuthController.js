const router    = require("express").Router();
const mongoose  = require('mongoose');
const User      = require('../models/users');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (error, hashedPass) => {
        if(error) {
            res.json({
                error: error
            })
        }
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            password: hashedPass,
            isActive: true
        })
    
        user.save().then(user => {
            res.json({
                message: 'User Added Successfully!!!'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error occured!!!'
            })
        });
    });
});

router.post('/login', async (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        $or: [
            {
                email: email
            },
            {
                password: password
            }
        ]
    })
    .then(user => {
        if(user) {
            bcrypt.compare(password, user.password, (error, result) => {
                if(error) {
                    res.json({
                        message: "An error occured while login!!!",
                        error: error
                    });
                }
                if(result) {
                    // 2nd param in jwt sign is a secret token for matching the token for authorize
                    let token = jwt.sign({ email : user.email, id: user._id }, 'JG^%568GJH6GU6&*&&gjh',
                    {
                        expiresIn: '2h',
                    });
                    res.json({
                        message: "Login Successfull!!!",
                        Data: user,
                        token
                    });
                }
                else {
                    res.json({
                        message: "Password does not match..."
                    });
                }
            })
        }
        else {
            res.json({
                message: "No user found!!!"
            });
        }
    })
})

module.exports = router;