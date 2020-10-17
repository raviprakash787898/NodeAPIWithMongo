const router = require("express").Router();
const mongoose = require('mongoose');

// Model
require('../models/users');
require('../models/messages');

const userDataModel = mongoose.model("Users");
const userMessageDataModel = mongoose.model("Messages");

// Get User API
router.get('/getList', async (req,res) => {
    const data = await userDataModel.find({});
    res.send(data);
});

// Post User API
router.post('/add', async (req,res) => {
    const postData = new userDataModel();
    console.log(req.body);
    postData.name = req.body.name;
    postData.email = req.body.email;
    postData.gender = req.body.gender;
    await postData.save();
    res.send(postData);
});

// Get UserById API
router.get('/:id', async (req,res) => {
    const postData = await userDataModel.findById(req.params.id);
    res.send(postData);
});

// Get UserById API
router.put('/:id', async (req,res) => {
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
router.delete('/:id', async (req,res) => {
    const postData = await userDataModel.findByIdAndRemove({
        _id: req.params.id
    });
    res.send(postData);
});


// Send Message
router.post('/:id/send', async (req, res) => {
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
router.get('/messages', async (req, res) => {
    const userMessage = await userMessageDataModel.find({} , {message: 1, user: 0});
    res.send(userMessage);
});

// Get Message For User
router.get('/:id/send', async (req, res) => {
    const userData = await userDataModel.findById(req.params.id).populate("messages");
    res.send(userData);
});

// Delete all Message
router.delete('/:id/send', async (req, res) => {
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
router.delete('/:id/send/:messageId', async (req, res) => {
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


module.exports = router;