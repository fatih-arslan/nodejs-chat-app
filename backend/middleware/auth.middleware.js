const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if(!decoded) {
                return res.status(401).json({error: 'Unauthorized - Invalid Token'});
            }

            const user = await User.findById(decoded.userId);

            if(!user) {
                return res.status(400).json({error: 'User not found'});
            }

            req.user = user;
            next();

        } else {    
            return res.status(401).json({error: 'Unauthorized - No Token Provided'});
        }
    }
    catch(error) {
        console.log(`Error in protect route middleware: ${error.message}`);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = requireAuth;