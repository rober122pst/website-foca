const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpires: Date,
    failedAttempts: { type: Number, default: 0 },
    lastFailedLogin: Date,
    lockedUntil: Date
});

module.exports = mongoose.model('User', userSchema);