const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const cors = require('cors');

const MONGODB_URI = "mongodb+srv://westeelbuilding_db:C7DXyg5Y95c9i1Hi@westeelbuilding.jw946zw.mongodb.net/westeelbuilding_db?retryWrites=true&w=majority";

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5500',
        'https://westeel-building.vercel.app',
        'https://westeel-building-*.vercel.app',  // For preview deployments
        '*'  // Temporarily allow all origins for testing
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(MONGODB_URI || process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(helmet());
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