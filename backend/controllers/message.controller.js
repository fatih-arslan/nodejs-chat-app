const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const {getReceiverSocketId, io } = require("../socket/socket.js");
const asyncErrorHandler = require('../utils/asyncErrorHandler.js');

exports.sendMessage = asyncErrorHandler(
  async (req, res, next) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // check if a conversation between the two users exists
    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]},
    });

    // create a conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create(
        new Conversation({
          participants: [senderId, receiverId]
        })
      );
    }

    // create a new message
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      content: message,
    });

    // add the new message to the messages array of the conversation
    conversation.messages.push(newMessage._id);

    // Socket.io functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // save the new data (Promise.all() will let them run in parallel)
    Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
    
  }
);


exports.getMessages = asyncErrorHandler(
  async (req, res, next) => {
    const userId = req.user._id;
    const { id: secondUserId } = req.params;
    
    const conversation = await Conversation.findOne({participants: {$all: [userId, secondUserId]}}).populate('messages');

    if(!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  }
);