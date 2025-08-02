const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // OTP expires after 5 minutes
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

// Index for faster queries
otpSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("OTP", otpSchema); 