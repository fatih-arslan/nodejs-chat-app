const http = require('http');
const express = require('express');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ['GET', 'POST']
    }
})

const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

// io.on is used to listen for events on the server side that are related to the overall Socket.IO server.Typically used at the beginning when a new client connects.
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on is used to listen for events on the server side that are specific to a particular client socket.Lets you handle events triggered by a single client.
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


module.exports = {getReceiverSocketId, app, io, server};