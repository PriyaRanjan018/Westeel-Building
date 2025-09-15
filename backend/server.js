const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'https://thebox-construction.vercel.app',  // ← Add YOUR Vercel URL here
        'https://*.vercel.app'  // Allow all Vercel preview URLs
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/westeel_building', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/newsletter', require('./routes/newsletter'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Westeel Building API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            contact: '/api/contact',
            projects: '/api/projects',
            newsletter: '/api/newsletter'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});