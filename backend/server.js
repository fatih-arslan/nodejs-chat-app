const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./middleware/errorHandler.middleware');
const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const userRoutes = require('./routes/user.routes');
const connectToMongoDB = require('./db/connectToMongoDB');

const {app, server} = require('./socket/socket');
const CustomError = require('./utils/customError');

dotenv.config();

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to an uncaught exception');
    server.close(() => {
        process.exit(1);
    })
});

app.use(express.json()); // to parse the JSON payloads in the request body (from req.body)
app.use(cookieParser()); // to parse the cookies attached to the incoming HTTP request object (from req.cookies)

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.all('*', (req, res, next) => {
    const err = new CustomError(`${req.originalUrl} route not found`, 404);
    next(err);
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Listening on port: ${PORT}`);
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to an unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    })
});

