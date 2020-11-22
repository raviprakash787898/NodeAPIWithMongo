const router = require("express").Router();
const mongoose = require('mongoose');
const authorizationCheck = require('../middleware/authorize');
const UserRoles = require('../models/userRoles');
const UserRolesAssoc = require('../models/userRoleAssociation');

// Model
require('../models/users');
require('../models/messages');

const userDataModel = mongoose.model("Users");
const userMessageDataModel = mongoose.model("Messages");

// Get User API
router.get('/:id/getList', [ authorizationCheck.AuthorizeRequest, authorizationCheck.RequestPermission(1) ] , async (req,res) => {
    const data = await userDataModel.find({});
    res.send({
        message: 'Sucess',
        Data: data
    });
});

// Post User API
router.post('/:id/add', authorizationCheck.AuthorizeRequest, async (req,res) => {
    const postData = new userDataModel();
    console.log(req.body);
    postData.name = req.body.name;
    postData.email = req.body.email;
    postData.gender = req.body.gender;
    postData.phone = req.body.phone;
    postData.password = req.body.password;
    postData.isActive = true;
    await postData.save();
    res.send(postData);
});

// Get UserById API
router.get('/:id', authorizationCheck.AuthorizeRequest, async (req,res) => {
    const postData = await userDataModel.findById(req.params.id);
    res.send(postData);
});

// Get UserById API
router.put('/:id', authorizationCheck.AuthorizeRequest, async (req,res) => {
    const postData = await userDataModel.findByIdAndUpdate({
        _id: req.params.id
    }, req.body, {
        // To get the new updated value in response
        new: true,
        // to check all validation applied on schema
        runValidators: true
    });
    res.send(postData);
});

// Delete UserById API
router.delete('/:id', authorizationCheck.AuthorizeRequest, async (req,res) => {
    const postData = await userDataModel.findByIdAndRemove({
        _id: req.params.id
    });
    res.send(postData);
});


// Send Message
router.post('/:id/send', authorizationCheck.AuthorizeRequest, async (req, res) => {
    const userData = await userDataModel.findById(req.params.id);
    const message = new userMessageDataModel();
    message.message = req.body.message;
    message.user = userData._id;
    console.log(req.body);
    await message.save();
    userData.messages.push(message._id);
    await userData.save();
    res.send(message);
});

// Get All Message
router.get('/messages', authorizationCheck.AuthorizeRequest, async (req, res) => {
    const userMessage = await userMessageDataModel.findOne({});
    res.send(userMessage);
});

// Get Message For User
router.get('/:id/send', authorizationCheck.AuthorizeRequest, async (req, res) => {
    const userData = await userDataModel.findById(req.params.id).populate("messages");
    res.send(userData);
});

// Delete all Message
router.delete('/:id/send', authorizationCheck.AuthorizeRequest, async (req, res) => {
    const userData = await userDataModel.findById(req.params.id);
    userData.messages.forEach((item) => {
        userMessageDataModel.findByIdAndDelete(item);
    });

    while(userData.messages.length) {
        userData.messages.pop();
    };
    await userData.save();
    res.send(userData);
});

// Delete single Message
router.delete('/:id/send/:messageId', authorizationCheck.AuthorizeRequest, async (req, res) => {
    const userData = await userDataModel.findById(req.params.id);
    userData.messages.forEach((item, i) => {
        if(item == req.params.messageId) {
            userMessageDataModel.findByIdAndDelete(item);
            userData.messages.splice(i,1);
        }
    });
    await userData.save();
    res.send(userData);
});

// Create user roles
router.post('/createRole', authorizationCheck.AuthorizeRequest, async (req, res) => {
    let userRole = new UserRoles({
        roleId: req.body.roleId,
        name: req.body.name,
        priority: req.body.priority
    });
    await userRole.save();
    res.send({
        message: 'User Role created successfully...'
    });
});

// Assign Roles to user
router.post('/:id/createUserRole', authorizationCheck.AuthorizeRequest, async (req, res) => {
    const userData = await userDataModel.findById(req.params.id);
    UserRoles.findOne({
        $and: [
            {
                name: req.body.name
            }
        ]
    })
    .then(role => {
        let userRole = new UserRolesAssoc({
            role: role._id,
            user: userData._id
        });
        userRole.save();
        userData.roles.push(role._id);
        userData.save();
        res.send({
            message: 'User Role Associated successfully...'
        });
    });
});

module.exports = router;