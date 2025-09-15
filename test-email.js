// Test script (test-email.js)
require('dotenv').config();
const { sendEmail, validateEmailConfig } = require('./utils/emailService');

async function testEmail() {
    // Validate configuration
    const isValid = await validateEmailConfig();
    if (!isValid) {
        console.error('Email configuration is invalid');
        return;
    }
    
    // Test sending an email
    try {
        const result = await sendEmail({
            to: 'westeel-building@zohomail.in',
            subject: 'Test Email from TheBox',
            html: '<h1>Test Email</h1><p>This is a test email from TheBox Construction.</p>'
        });
        
        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

testEmail();