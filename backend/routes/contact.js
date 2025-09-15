const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('./contact');

// Validation middleware
const validateContact = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('reason').notEmpty().withMessage('Reason is required')
];

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', validateContact, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        // Create new contact
        const contact = new Contact(req.body);
        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: contact
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form'
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contacts (admin only - add auth later)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
});

module.exports = router;