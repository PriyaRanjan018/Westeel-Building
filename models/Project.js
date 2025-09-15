const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['commercial', 'residential', 'other']
    },
    imageUrl: {
        type: String,
        required: true
    },
    completionDate: {
        type: Date
    },
    client: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);