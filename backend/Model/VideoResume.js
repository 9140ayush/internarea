const mongoose = require("mongoose");

const videoResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    default: null
  },
  uploadTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  metadata: {
    resolution: String,
    format: String,
    bitrate: Number
  }
});

// Index for faster queries
videoResumeSchema.index({ userId: 1, uploadTime: -1 });
videoResumeSchema.index({ email: 1 });

module.exports = mongoose.model("VideoResume", videoResumeSchema); 