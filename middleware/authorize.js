const jwt = require("jsonwebtoken");
const { use } = require("../Controller/User");
const UserRoles = require('../models/userRoles');
const User = require('../models/users');

const AuthorizeRequest = (req, res, next) => {
    if(req.headers['authorization']) {
        try {
            const token = req.headers.authorization.split(' ')[1];
                if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
                    return res.status(401).json({
                        message: "Authentication Bearer required!!!"
                    })
                    .send();
                }
                else {
                    const decode = jwt.verify(token, 'JG^%568GJH6GU6&*&&gjh');
        
                    req.user = decode;
                    next();
                }
        }
        catch(error) {
            res.status(403).json({
                message: "Invalid Authentication Token!!!"
            }).send();
        }
    }
    else {
        res.status(401).json({
            message: "Authentication Failed!!!"
        })
        .send();
    }
}

const RequestPermission = (permissionId) => {
    return (req, res, next) => {
        var id = parseInt(permissionId);
        if (req.headers && req.headers["authorization"]) {
            var authorization = req.headers.authorization.split(' ')[1];
            var decoded;
            try {
                decoded = jwt.verify(authorization, 'JG^%568GJH6GU6&*&&gjh');
            } catch (e) {
                return res.status(401).send('unauthorized access...');
            }
            var userId = decoded.id;

            // Fetch the user by id
            User.findOne({ _id: userId })
            .then(function(user) {
                UserRoles.findOne({
                    $or: [
                        {
                            roleId: id
                        }
                    ]
                })
                .then(role => {
                    const userData = JSON.parse(JSON.stringify(user));
                    var check = userData.roles.includes(role._id.toString());
                    if (check) {
                        return next();
                    } else {
                        return res.status(403).send('unauthorized role access...');
                    }
                })
                .catch(error => {
                    return res.status(403).send({
                        error: 'Roles does not match ' + error,
                        RoleId: id,
                        Data: user
                    });
                });
            })
            .catch(error => {
                return res.status(403).send({
                    error: 'User does not match'
                });
            });
        }
        else {
            return res.send(500);
        }
    }
}

module.exports = { AuthorizeRequest, RequestPermission };