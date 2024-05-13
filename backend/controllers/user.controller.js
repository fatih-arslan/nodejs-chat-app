const User = require('../models/user.model.js');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');

exports.getUsers = asyncErrorHandler(
    async (req, res, next) => {
        const loggedInUserId = req.user._id;

        const users = await User.find({_id: {$ne: loggedInUserId}});

        res.status(200).json(users);    
    }
);