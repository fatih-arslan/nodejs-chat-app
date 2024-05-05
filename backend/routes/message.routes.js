const express = require('express');
const { sendMessage, getMessages } = require('../controllers/message.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:id',requireAuth, getMessages);
router.post('/send/:id', requireAuth, sendMessage);

module.exports = router;

