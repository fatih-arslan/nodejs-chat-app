const User = require('../models/user.model.js');
const genderEnum = require('../enums/genderEnum');
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require('../utils/generateWebToken');
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');
const syncErrorHandler = require('../utils/syncErrorHandler.js');
const CustomError = require('../utils/customError.js');

exports.signup = asyncErrorHandler(
    async (req, res, next) => {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword) {
            const error = new CustomError("Passwords don't match", 400);
            return next(error);
        }

        const user = await User.findOne({username});

        if(user) {
            const error = new CustomError("Username already exists", 400);
            return next(error);
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
            const error = new CustomError("Invalid user data", 400);
            return next(error);
        }              
    }
);

exports.login = asyncErrorHandler(
    async (req, res, next) => {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ''); // will compare with an empty string if the user is null

        if(!user || !isPasswordCorrect) {
            const error = new CustomError("Invalid username or password", 400);
            return next(error)
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
);

exports.logout = syncErrorHandler(
    (req, res, next) => {
        res.clearCookie('jwt');
        res.status(200).json({message: 'Logged out successfully'});
    }
);