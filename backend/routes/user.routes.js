const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth.middleware');
const { getUsers } = require('../controllers/user.controller');


router.get('/', requireAuth, getUsers);

module.exports = router;