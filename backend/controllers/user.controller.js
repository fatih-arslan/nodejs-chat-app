const User = require('../models/user.model.js');

exports.getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const users = await User.find({_id: {$ne: loggedInUserId}});

        res.status(200).json(users);
    }
    catch(error) {
        console.log(`Error on getting users: ${error.message}`);
        res.status(500).json({error: 'Internal server error'});
    }

}