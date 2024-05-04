const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const connectToMongoDB = require('./db/connectToMongoDB');

const app = express();

dotenv.config();

app.use(express.json()); // to parse the JSON payloads in the request body (from req.body)
app.use(cookieParser()); // to parse the cookies attached to the incoming HTTP request object (from req.cookies)

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Yo ho ho ho ho'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Listening on port: ${PORT}`);
})