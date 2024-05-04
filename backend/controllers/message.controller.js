const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

exports.sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const{id: receiverId} = req.params;
        const senderId = req.user._id;
        
        // check if a conversation between the two users exists
        let conversation = await Conversation.findOne({participants: [senderId, receiverId]});

        // create a conversation if it doesn't exist
        if(!conversation) {
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
            content: message
        });

        // add the new message to the messages array of the conversation
        conversation.messages.push(newMessage._id);   
        
        // save the new data (Promise.all() will let them run in parallel)
        Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    }
    catch(error) {
        console.log(`Error on sending a message: ${error.message}`);
        return res.status(500).json({message: 'Internal server error'});
    }

}