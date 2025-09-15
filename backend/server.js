const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://westeelbuilding_db:C7DXyg5Y95c9i1Hi@westeelbuilding.jw946zw.mongodb.net/westeelbuilding_db?retryWrites=true&w=majority&appName=westeelbuilding";

// Mongoose connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Timeout after 10s
    socketTimeoutMS: 45000, // Close sockets after 45s
};

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin
        if (!origin) return callback(null, true);
        
        // Allow all origins for now (fix later for production)
        callback(null, true);
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
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// MongoDB Connection with detailed error handling
console.log('Attempting MongoDB connection...');
mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log('Database:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        // Don't exit the process, let the API still work
    });

// Monitor connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Routes - Make sure these files exist!
try {
    app.use('/api/contact', require('./routes/contact'));
    app.use('/api/projects', require('./routes/projects'));
    app.use('/api/newsletter', require('./routes/newsletter'));
} catch (error) {
    console.error('Error loading routes:', error.message);
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: states[dbState] || 'Unknown',
        databaseState: dbState,
        environment: process.env.NODE_ENV || 'development',
        mongoUri: MONGODB_URI ? 'Set' : 'Not set'
    });
});

// Root API endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Westeel Building API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: '/api/health',
            contact: '/api/contact',
            projects: '/api/projects',
            newsletter: '/api/newsletter'
        }
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Westeel Building Backend Server',
        status: 'Running'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Export for Vercel
module.exports = app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}