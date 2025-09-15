const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// MongoDB connection string - will be set in Vercel
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thebox';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB error:', err);
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    reason: { type: String, required: true },
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Routes
app.get('/api', (req, res) => {
    res.json({
        message: 'TheBox API',
        endpoints: {
            contact: 'POST /api/contact',
            newsletter: 'POST /api/newsletter',
            health: 'GET /api/health'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to submit form' });
    }
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });
        }
        
        const subscriber = new Newsletter({ email });
        await subscriber.save();
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to subscribe' });
    }
});

// Export for Vercel
module.exports = app;