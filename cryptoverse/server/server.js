const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// const pickle = require('pickle');
// const GridFsStorage = require('multer-gridfs-storage');
// const multer = require('multer');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const dbURI = 'mongodb://localhost:27017/Crypto-currency';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        const connection = mongoose.connection;
        gfs = Grid(connection.db, mongoose.mongo);
        gfs.collection('fs');
    })
    .catch(err => {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('users', userSchema);
app.post('/api/users/register', async(req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(200).json({ message: 'Account created successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users/loginpage', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));