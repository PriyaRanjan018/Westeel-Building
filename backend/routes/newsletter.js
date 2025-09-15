const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');

// @route   POST /api/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email } = req.body;

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: 'Email already subscribed'
            });
        }

        // Create new subscriber
        const subscriber = new Newsletter({ email });
        await subscriber.save();

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter',
            data: subscriber
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to newsletter'
        });
    }
});

// @route   GET /api/newsletter
// @desc    Get all subscribers (admin only - add auth later)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ status: 'active' });
        res.json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers'
        });
    }
});

module.exports = router;