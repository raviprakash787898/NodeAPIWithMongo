const router    = require("express").Router();
const mongoose  = require('mongoose');
const User      = require('../models/users');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

const toDeleteKey = ['isActive', 'password', 'roles', 'messages'];


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
            let user_Info = removeKeyFromObject(user, toDeleteKey);
            res.json({
                status: 'Success',
                message: 'User Added Successfully!!!',
                error: '',
                Data: user_Info
            })
        })
        .catch(error => {
            res.json({
                status: 'Fail',
                message: '',
                error: 'An error occured while registering!!!',
                Data: {}
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
                        status: 'Fail',
                        message: '',
                        error: 'An error occured while login!!! ' + error,
                        Data: {}
                    });
                }
                if(result) {
                    // 2nd param in jwt sign is a secret token for matching the token for authorize
                    let token = jwt.sign({ email : user.email, id: user._id }, 'JG^%568GJH6GU6&*&&gjh',
                    {
                        expiresIn: '2h',
                    });
                    let user_Info = removeKeyFromObject(user, toDeleteKey);
                    res.json({
                        status: 'Success',
                        message: 'Successfully Loggned In',
                        error: '',
                        Data: user_Info,
                        token
                    });
                }
                else {
                    res.json({
                        status: 'Fail',
                        message: '',
                        error: 'Password does not match...',
                        Data: {}
                    });
                }
            })
        }
        else {
            res.json({
                status: 'Fail',
                message: '',
                error: 'No user found!!!',
                Data: {}
            });
        }
    })
})

const removeKeyFromObject = (obj, toDeleteKey) => {
    toDeleteKey.forEach((item, i) => {
        delete obj[item];
    });
    return obj;
}

module.exports = router;