const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');

// Validation middleware
const validateContact = [
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('reason').notEmpty().trim().escape(),
    body('phone').optional().isMobilePhone(),
    body('message').optional().trim().escape()
];

// POST - Submit contact form
router.post('/', validateContact, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, reason, phone, message } = req.body;

        // Save to database
        const newContact = new Contact({
            name,
            email,
            reason,
            phone,
            message
        });

        await newContact.save();

        // Send notification to admin using template
        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'westeel-building@zohomail.in',
            template: 'adminNotification',
            templateData: { name, email, reason, phone, message }
        });

        // Send confirmation to user using template
        await sendEmail({
            to: email,
            template: 'contactConfirmation',
            templateData: name
        });

        res.status(200).json({ 
            success: true, 
            message: 'Contact form submitted successfully' 
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit contact form' 
        });
    }
});

// GET - Retrieve all contacts (admin only)
router.get('/', async (req, res) => {
    try {
        // Add authentication middleware here for production
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
});

module.exports = router;