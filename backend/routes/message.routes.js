const express = require('express');
const { sendMessage } = require('../controllers/message.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/send/:id', requireAuth, sendMessage);

module.exports = router;

