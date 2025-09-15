const mongoose = require('mongoose');

// Your connection string
const MONGODB_URI = "mongodb+srv://westeelbuilding_db:C7DXyg5Y95c9i1Hi@westeelbuilding.jw946zw.mongodb.net/westeelbuilding_db?retryWrites=true&w=majority";

console.log('Testing MongoDB connection...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connected successfully!');
    console.log('Database name:', mongoose.connection.name);
    mongoose.connection.close();
})
.catch(err => {
    console.error('❌ Connection failed:', err.message);
    if (err.message.includes('ENOTFOUND')) {
        console.error('→ DNS resolution failed. Check your cluster URL.');
    } else if (err.message.includes('authentication failed')) {
        console.error('→ Wrong username or password.');
    } else if (err.message.includes('Network')) {
        console.error('→ Network access issue. Check IP whitelist.');
    }
});