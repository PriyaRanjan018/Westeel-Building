const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { sendEmail, sendBatchEmails } = require('../utils/emailService');

// POST - Subscribe to newsletter
router.post('/', [
    body('email').isEmail().normalizeEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Check if already subscribed
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already subscribed' 
            });
        }

        // Save to database
        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        // Send welcome email using template
        await sendEmail({
            to: email,
            template: 'newsletterWelcome',
            templateData: null
        });

        res.status(200).json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter' 
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to subscribe' 
        });
    }
});

// POST - Send newsletter to all subscribers (admin only)
router.post('/send', async (req, res) => {
    try {
        // Add authentication middleware here
        const { subject, content } = req.body;
        
        // Get all active subscribers
        const subscribers = await Newsletter.find({ isActive: true });
        const emails = subscribers.map(sub => sub.email);
        
        if (emails.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No active subscribers' 
            });
        }
        
        // Send batch emails
        const result = await sendBatchEmails(emails, subject, content);
        
        res.status(200).json({ 
            success: true, 
            message: `Newsletter sent to ${result.totalSent} subscribers`,
            details: result
        });
    } catch (error) {
        console.error('Newsletter send error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send newsletter' 
        });
    }
});

// DELETE - Unsubscribe from newsletter
router.delete('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        const result = await Newsletter.findOneAndUpdate(
            { email },
            { isActive: false },
            { new: true }
        );
        
        if (!result) {
            return res.status(404).json({ 
                success: false, 
                message: 'Email not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Successfully unsubscribed' 
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to unsubscribe' 
        });
    }
});

module.exports = router;