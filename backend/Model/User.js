const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // Firebase/Google OAuth fields
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  photoURL: {
    type: String,
    default: null
  },
  // Profile image (can be uploaded or generated)
  profileImage: {
    type: String,
    default: null
  },
  avatarType: {
    type: String,
    enum: ['uploaded', 'dicebear', 'google'],
    default: 'google'
  },
  // Session management
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for getting the display image (profileImage or photoURL)
userSchema.virtual('displayImage').get(function() {
  return this.profileImage || this.photoURL;
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", userSchema); 