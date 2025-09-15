// test-all.js - Complete system test
require('dotenv').config();
const mongoose = require('mongoose');
const { sendEmail, validateEmailConfig } = require('./utils/emailService');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

console.log(colors.blue + '\n========================================');
console.log('    THEBOX CONSTRUCTION SYSTEM TEST    ');
console.log('========================================\n' + colors.reset);

// Test results tracker
let testResults = {
    passed: 0,
    failed: 0,
    warnings: 0
};

// Test functions
async function testEnvironmentVariables() {
    console.log(colors.yellow + '\n📋 Testing Environment Variables...\n' + colors.reset);
    
    const requiredVars = [
        'MONGODB_URI',
        'SENDGRID_API_KEY',
        'SENDGRID_VERIFIED_SENDER',
        'ADMIN_EMAIL'
    ];
    
    const optionalVars = [
        'PORT',
        'NODE_ENV',
        'REPLY_TO_EMAIL'
    ];
    
    let allRequired = true;
    
    // Check required variables
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(colors.green + `✅ ${varName}: Set` + colors.reset);
            testResults.passed++;
        } else {
            console.log(colors.red + `❌ ${varName}: Missing (REQUIRED)` + colors.reset);
            testResults.failed++;
            allRequired = false;
        }
    });
    
    // Check optional variables
    optionalVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(colors.green + `✅ ${varName}: Set` + colors.reset);
        } else {
            console.log(colors.yellow + `⚠️  ${varName}: Not set (optional)` + colors.reset);
            testResults.warnings++;
        }
    });
    
    return allRequired;
}

async function testDatabaseConnection() {
    console.log(colors.yellow + '\n🗄️  Testing Database Connection...\n' + colors.reset);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thebox', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log(colors.green + '✅ MongoDB connected successfully' + colors.reset);
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log(`   Host: ${mongoose.connection.host}`);
        
        // Test creating a document
        const Contact = require('./models/Contact');
        const testContact = new Contact({
            name: 'Test User',
            email: 'westeel-building@zohomail.in',
            reason: 'construction',
            message: 'This is a test entry'
        });
        
        await testContact.save();
        console.log(colors.green + '✅ Can write to database' + colors.reset);
        
        // Clean up test data
        await Contact.deleteOne({ email: 'westeel-building@zohomail.in' });
        console.log(colors.green + '✅ Can delete from database' + colors.reset);
        
        testResults.passed += 3;
        return true;
    } catch (error) {
        console.log(colors.red + `❌ Database connection failed: ${error.message}` + colors.reset);
        testResults.failed++;
        return false;
    }
}

async function testEmailService() {
    console.log(colors.yellow + '\n📧 Testing Email Service...\n' + colors.reset);
    
    try {
        // Validate configuration
        const isValid = await validateEmailConfig();
        if (isValid) {
            console.log(colors.green + '✅ SendGrid configuration is valid' + colors.reset);
            testResults.passed++;
        } else {
            console.log(colors.red + '❌ SendGrid configuration is invalid' + colors.reset);
            testResults.failed++;
            return false;
        }
        
        // Test sending email
        console.log('   Attempting to send test email...');
        const result = await sendEmail({
            to: process.env.ADMIN_EMAIL || 'westeel-building@zohomail.in',
            subject: 'System Test - TheBox Construction',
            html: `
                <h2>System Test Email</h2>
                <p>This is an automated test email from TheBox Construction website.</p>
                <p>Timestamp: ${new Date().toISOString()}</p>
                <ul>
                    <li>✅ Email service is working</li>
                    <li>✅ SendGrid integration successful</li>
                    <li>✅ Ready for production</li>
                </ul>
            `
        });
        
        console.log(colors.green + '✅ Test email sent successfully' + colors.reset);
        console.log(`   Message ID: ${result.messageId}`);
        console.log(`   Sent to: ${process.env.ADMIN_EMAIL}`);
        testResults.passed++;
        
        return true;
    } catch (error) {
        console.log(colors.red + `❌ Email service test failed: ${error.message}` + colors.reset);
        testResults.failed++;
        return false;
    }
}

async function testAPIEndpoints() {
    console.log(colors.yellow + '\n🔌 Testing API Endpoints...\n' + colors.reset);
    
    const fetch = require('node-fetch');
    const baseUrl = `http://localhost:${process.env.PORT || 3000}`;
    
    // Start the server
    const app = require('./server');
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const endpoints = [
        { method: 'GET', path: '/api/health', expected: 200 },
        { method: 'GET', path: '/api/projects', expected: 200 },
        { method: 'POST', path: '/api/contact', expected: 200, body: {
            name: 'API Test',
            email: 'westeel-building@zohomail.in',
            reason: 'construction',
            message: 'Testing API endpoint'
        }},
        { method: 'POST', path: '/api/newsletter', expected: 200, body: {
            email: 'westeel-building@zohomail.in'
        }}
    ];
    
    for (const endpoint of endpoints) {
        try {
            const options = {
                method: endpoint.method,
                headers: { 'Content-Type': 'application/json' }
            };
            
            if (endpoint.body) {
                options.body = JSON.stringify(endpoint.body);
            }
            
            const response = await fetch(baseUrl + endpoint.path, options);
            
            if (response.status === endpoint.expected) {
                console.log(colors.green + `✅ ${endpoint.method} ${endpoint.path}: Working (${response.status})` + colors.reset);
                testResults.passed++;
            } else {
                console.log(colors.red + `❌ ${endpoint.method} ${endpoint.path}: Failed (${response.status})` + colors.reset);
                testResults.failed++;
            }
        } catch (error) {
            console.log(colors.red + `❌ ${endpoint.method} ${endpoint.path}: Error - ${error.message}` + colors.reset);
            testResults.failed++;
        }
    }
    
    // Clean up test data
    const Newsletter = require('./models/Newsletter');
    await Newsletter.deleteOne({ email: 'westeel-building@zohomail.in' });
    const Contact = require('./models/Contact');
    await Contact.deleteOne({ email: 'westeel-building@zohomail.in' });
}

async function testFrontend() {
    console.log(colors.yellow + '\n🎨 Testing Frontend Files...\n' + colors.reset);
    
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
        'public/index.html',
        'public/styles.css',
        'public/script.js'
    ];
    
    requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(colors.green + `✅ ${file}: Found (${(stats.size / 1024).toFixed(2)} KB)` + colors.reset);
            testResults.passed++;
        } else {
            console.log(colors.red + `❌ ${file}: Missing` + colors.reset);
            testResults.failed++;
        }
    });
}

async function runAllTests() {
    try {
        // Test 1: Environment Variables
        await testEnvironmentVariables();
        
        // Test 2: Database Connection
        await testDatabaseConnection();
        
        // Test 3: Email Service
        await testEmailService();
        
        // Test 4: Frontend Files
        await testFrontend();
        
        // Test 5: API Endpoints (optional - requires server running)
        // await testAPIEndpoints();
        
        // Display Results
        console.log(colors.blue + '\n========================================');
        console.log('            TEST RESULTS                ');
        console.log('========================================\n' + colors.reset);
        
        console.log(colors.green + `✅ Passed: ${testResults.passed}` + colors.reset);
        console.log(colors.red + `❌ Failed: ${testResults.failed}` + colors.reset);
        console.log(colors.yellow + `⚠️  Warnings: ${testResults.warnings}` + colors.reset);
        
        const totalTests = testResults.passed + testResults.failed;
        const successRate = ((testResults.passed / totalTests) * 100).toFixed(1);
        
        console.log(`\n📊 Success Rate: ${successRate}%`);
        
        if (testResults.failed === 0) {
            console.log(colors.green + '\n🎉 All tests passed! Your system is ready for deployment.' + colors.reset);
        } else {
            console.log(colors.red + '\n⚠️  Some tests failed. Please fix the issues before deploying.' + colors.reset);
        }
        
        // Close database connection
        await mongoose.connection.close();
        process.exit(testResults.failed === 0 ? 0 : 1);
        
    } catch (error) {
        console.error(colors.red + '\n❌ Test suite error:', error + colors.reset);
        process.exit(1);
    }
}

// Run tests
runAllTests();