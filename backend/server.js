const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const connectToMongoDB = require('./db/connectToMongoDB');

const app = express();

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Listening on port: ${PORT}`);
})