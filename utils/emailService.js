const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email templates
const emailTemplates = {
    contactConfirmation: (name) => ({
        subject: 'Thank you for contacting TheBox Construction',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2441E5; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                    .button { display: inline-block; padding: 12px 30px; background: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    h1 { margin: 0; }
                    h2 { color: #2441E5; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>TheBox Construction</h1>
                        <p>Building Excellence Since 2021</p>
                    </div>
                    <div class="content">
                        <h2>Thank you for reaching out, ${name}!</h2>
                        <p>We have received your inquiry and appreciate your interest in our services.</p>
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our team will review your request within 24 hours</li>
                            <li>A construction specialist will contact you to discuss your project</li>
                            <li>We'll provide a free consultation and preliminary quote</li>
                        </ul>
                        <p>If you have any urgent questions, feel free to call us at <strong>+84 1102 2703</strong></p>
                        <center>
                            <a href="https://thebox.com" class="button">Visit Our Website</a>
                        </center>
                    </div>
                    <div class="footer">
                        <p>© 2024 TheBox Construction. All rights reserved.</p>
                        <p>6391 Elgin St. Celina, Delaware 10299</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),
    
    adminNotification: (contactData) => ({
        subject: `New Contact Form Submission - ${contactData.reason}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2441E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .label { font-weight: bold; width: 120px; color: #666; }
                    .value { flex: 1; color: #333; }
                    .message-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
                    .priority { display: inline-block; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; }
                    .priority.high { background: #ff4444; color: white; }
                    .priority.medium { background: #ffbb33; color: white; }
                    .priority.low { background: #00C851; color: white; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Contact Form Submission</h2>
                        <span class="priority ${contactData.reason === 'construction' ? 'high' : 'medium'}">
                            ${contactData.reason.toUpperCase()}
                        </span>
                    </div>
                    <div class="content">
                        <div class="info-row">
                            <span class="label">Name:</span>
                            <span class="value">${contactData.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span>
                            <span class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></span>
                        </div>
                        <div class="info-row">
                            <span class="label">Phone:</span>
                            <span class="value">${contactData.phone || 'Not provided'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Reason:</span>
                            <span class="value">${contactData.reason}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Date:</span>
                            <span class="value">${new Date().toLocaleString()}</span>
                        </div>
                        ${contactData.message ? `
                        <div class="message-box">
                            <strong>Message:</strong><br>
                            ${contactData.message}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </body>
            </html>
        `
    }),
    
    newsletterWelcome: () => ({
        subject: 'Welcome to TheBox Construction Newsletter',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #2441E5 0%, #1a2f9e 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #fff; padding: 40px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                    .feature { background: #f8f9fa; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0; }
                    .button { display: inline-block; padding: 15px 40px; background: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
                    .social-links { text-align: center; margin-top: 30px; }
                    .social-links a { margin: 0 10px; }
                    h1 { margin: 0; font-size: 32px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Our Newsletter!</h1>
                        <p style="font-size: 18px; margin-top: 10px;">You're now part of TheBox Construction community</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #2441E5;">Thank you for subscribing!</h2>
                        <p>We're excited to have you on board. As a subscriber, you'll receive:</p>
                        
                        <div class="feature">
                            <strong>🏗️ Project Updates</strong><br>
                            Get exclusive insights into our latest construction projects and innovations
                        </div>
                        
                        <div class="feature">
                            <strong>💡 Construction Tips</strong><br>
                            Expert advice on construction, renovation, and maintenance
                        </div>
                        
                        <div class="feature">
                            <strong>📰 Industry News</strong><br>
                            Stay updated with the latest trends in construction and architecture
                        </div>
                        
                        <div class="feature">
                            <strong>🎁 Special Offers</strong><br>
                            Exclusive discounts and early access to our services
                        </div>
                        
                        <center>
                            <a href="https://thebox.com/projects" class="button">View Our Projects</a>
                        </center>
                        
                        <div class="social-links">
                            <p><strong>Connect with us:</strong></p>
                            <a href="#">Facebook</a> |
                            <a href="#">LinkedIn</a> |
                            <a href="#">Twitter</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2024 TheBox Construction. All rights reserved.</p>
                        <p>6391 Elgin St. Celina, Delaware 10299 | +84 1102 2703</p>
                        <p><a href="https://thebox.com/unsubscribe">Unsubscribe</a> | <a href="https://thebox.com/preferences">Update Preferences</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    })
};

// Main email sending function
const sendEmail = async ({ to, subject, html, template, templateData }) => {
    try {
        let emailContent = { subject, html };
        
        // Use template if specified
        if (template && emailTemplates[template]) {
            emailContent = emailTemplates[template](templateData);
        }
        
        const msg = {
            to: Array.isArray(to) ? to : [to], // SendGrid accepts array of recipients
            from: {
                email: process.env.SENDGRID_VERIFIED_SENDER || 'westeel-building@zohomail.in',
                name: 'Westeel Building'
            },
            subject: emailContent.subject,
            html: emailContent.html,
            // Optional: Add plain text version for better deliverability
            text: emailContent.text || stripHtml(emailContent.html),
            // Optional: Add tracking settings
            trackingSettings: {
                clickTracking: {
                    enable: true,
                    enableText: true
                },
                openTracking: {
                    enable: true
                }
            },
            // Optional: Add custom headers
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        };
        
        // Add reply-to if specified
        if (process.env.REPLY_TO_EMAIL) {
            msg.replyTo = process.env.REPLY_TO_EMAIL;
        }
        
        // Send email
        const response = await sgMail.send(msg);
        
        console.log('Email sent successfully:', {
            messageId: response[0].headers['x-message-id'],
            to: to,
            subject: emailContent.subject
        });
        
        return {
            success: true,
            messageId: response[0].headers['x-message-id'],
            statusCode: response[0].statusCode
        };
    } catch (error) {
        console.error('SendGrid Error:', error);
        
        // Handle specific SendGrid errors
        if (error.response) {
            console.error('SendGrid Error Body:', error.response.body);
            
            // Check for specific error types
            if (error.code === 401) {
                throw new Error('SendGrid authentication failed. Please check API key.');
            } else if (error.code === 413) {
                throw new Error('Email content too large.');
            } else if (error.code === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }
        
        throw error;
    }
};

// Helper function to send batch emails (for newsletters)
const sendBatchEmails = async (recipients, subject, html) => {
    try {
        // SendGrid allows up to 1000 recipients per request
        const batchSize = 1000;
        const batches = [];
        
        for (let i = 0; i < recipients.length; i += batchSize) {
            batches.push(recipients.slice(i, i + batchSize));
        }
        
        const results = [];
        for (const batch of batches) {
            const msg = {
                to: batch,
                from: {
                    email: process.env.SENDGRID_VERIFIED_SENDER || 'westeel-building@zohomail.in',
                    name: 'Westeel Building'
                },
                subject: subject,
                html: html,
                text: stripHtml(html),
                // Use substitutions for personalization
                personalizations: batch.map(email => ({
                    to: [{ email }],
                    substitutions: {
                        '-email-': email
                    }
                })),
                // Batch ID for tracking
                batchId: `newsletter-${Date.now()}`
            };
            
            const response = await sgMail.send(msg);
            results.push(response);
        }
        
        return {
            success: true,
            totalSent: recipients.length,
            batches: results.length
        };
    } catch (error) {
        console.error('Batch email error:', error);
        throw error;
    }
};

// Helper function to strip HTML tags
const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '')
               .replace(/\s+/g, ' ')
               .trim();
};

// Validate email configuration on startup
const validateEmailConfig = async () => {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error('SENDGRID_API_KEY is not set in environment variables');
        }
        
        if (!process.env.SENDGRID_VERIFIED_SENDER) {
            console.warn('Warning: SENDGRID_VERIFIED_SENDER not set. Using default noreply@thebox.com');
        }
        
        // Test API key by sending a test request
        const testMsg = {
            to: 'test@example.com',
            from: process.env.SENDGRID_VERIFIED_SENDER || 'westeel-building@zohomail.in',
            subject: 'Test',
            text: 'Test',
            mailSettings: {
                sandboxMode: {
                    enable: true // This prevents actual sending
                }
            }
        };
        
        await sgMail.send(testMsg);
        console.log('✅ SendGrid configuration validated successfully');
        return true;
    } catch (error) {
        console.error('❌ SendGrid configuration validation failed:', error.message);
        return false;
    }
};

// Export functions
module.exports = {
    sendEmail,
    sendBatchEmails,
    validateEmailConfig,
    templates: emailTemplates
};