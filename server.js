require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Use Render-assigned port OR fallback to 3000 (for local testing)
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors()); // Handle CORS issues

// MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route to handle contact form submissions
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    
    // If you want to save to MongoDB:
    // const newContact = new Contact({ name, email, message });
    // newContact.save()
    //     .then(() => res.status(201).json({ message: 'Message sent successfully' }))
    //     .catch(err => res.status(500).json({ error: 'Failed to save message' }));

    res.status(200).json({ message: 'Message received successfully' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
