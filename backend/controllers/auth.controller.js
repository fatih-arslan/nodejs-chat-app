const User = require('../models/user.model');
const genderEnum = require('../enums/genderEnum');
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require('../utils/generateWebToken');

exports.signup = async (req, res) => {
    try{
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"});
        }

        const user = await User.findOne({username});

        if(user) {
            return res.status(400).json({error: 'Username already exists'});
        }

        // HASH PASSWORD 
        const salt = await bcrypt.genSalt(10);        
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === genderEnum.male ? boyProfilePic : girlProfilePic            
        });

        if(newUser) {
            // GENERATE TOKEN
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({error: 'Invalid user data'});
        }          
    }
    catch(error) {
        console.log(`Error on user signing up: ${error}`);
        res.status(500).json({error: 'Internal server error'});
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ''); // will compare with an empty string if the user is null

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: 'Invalid username or password'});
        }
        // GENERATE TOKEN
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic
            });        
    }
    catch (error) {
        console.log(`Error on user login: ${error}`);
        res.status(500).json({error: 'Internal server error'});
    }
}

exports.logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({message: 'Logged out successfully'});
    }
    catch(error) {
        console.log(`Error on user logout: ${error}`);
        res.status(500).json({error: 'Internal server error'});
    }
}