const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// MongoDB URI - Using your connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://westeelbuilding_db:C7DXyg5Y95c9i1Hi@westeelbuilding.jw946zw.mongodb.net/westeelbuilding_db?retryWrites=true&w=majority";

// CORS configuration - ONLY ONCE
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://localhost:5000',
            'https://westeel-building.vercel.app',
            'https://westeel-building-*.vercel.app'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true); // Temporarily allow all for testing
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Connection - ONLY ONCE
mongoose.connect(MONGODB_URI, {
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
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root API route
app.get('/api', (req, res) => {
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

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Westeel Building Backend Server',
        status: 'Running'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// For Vercel serverless function
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}