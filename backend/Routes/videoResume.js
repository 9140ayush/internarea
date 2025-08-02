const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const moment = require("moment-timezone");
const path = require("path");
const fs = require("fs");

// Import models
const OTP = require("../Model/OTP");
const VideoResume = require("../Model/VideoResume");
const User = require("../Model/User");

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/videos");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow MP4 files
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(new Error("Only MP4 files are allowed"), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to check if current time is between 2 PM and 7 PM IST
const isWithinUploadTime = () => {
  const istTime = moment().tz("Asia/Kolkata");
  const hour = istTime.hour();
  return hour >= 14 && hour < 19; // 2 PM to 7 PM
};

// Helper function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper function to get video duration (simplified without ffmpeg)
const getVideoDuration = (filePath) => {
  return new Promise((resolve) => {
    // For now, return a default duration since we can't use ffmpeg
    // In production, you might want to use a different approach or a cloud service
    resolve(60); // Default 60 seconds
  });
};

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if current time is within upload window
    if (!isWithinUploadTime()) {
      return res.status(403).json({ 
        error: "Video uploads are only allowed between 2 PM and 7 PM IST" 
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email: email,
      otp: otp,
      expiresAt: moment().add(10, "minutes").toDate(),
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Video Resume Upload OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Video Resume Upload OTP</h2>
          <p>Your OTP for video resume upload is:</p>
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Route to upload video resume
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { email, otp, userId } = req.body;
    const videoFile = req.file;

    if (!email || !otp || !videoFile) {
      return res.status(400).json({ error: "Email, OTP, and video file are required" });
    }

    // Check if current time is within upload window
    if (!isWithinUploadTime()) {
      return res.status(403).json({ 
        error: "Video uploads are only allowed between 2 PM and 7 PM IST" 
      });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email: email,
      otp: otp,
      expiresAt: { $gt: new Date() },
      used: false,
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Get video duration
    const duration = await getVideoDuration(videoFile.path);

    // Save video resume to database
    const videoResume = await VideoResume.create({
      userId: userId,
      fileName: videoFile.originalname,
      filePath: videoFile.path,
      fileSize: videoFile.size,
      duration: duration,
      uploadTime: new Date(),
    });

    res.json({ 
      message: "Video resume uploaded successfully",
      videoResume: videoResume 
    });
  } catch (error) {
    console.error("Error uploading video resume:", error);
    res.status(500).json({ error: "Failed to upload video resume" });
  }
});

// Route to get user's video resumes
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const videoResumes = await VideoResume.find({ userId: userId })
      .sort({ uploadTime: -1 });

    res.json({ videoResumes: videoResumes });
  } catch (error) {
    console.error("Error fetching video resumes:", error);
    res.status(500).json({ error: "Failed to fetch video resumes" });
  }
});

// Route to delete video resume
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const videoResume = await VideoResume.findById(id);
    if (!videoResume) {
      return res.status(404).json({ error: "Video resume not found" });
    }

    // Delete file from filesystem
    if (fs.existsSync(videoResume.filePath)) {
      fs.unlinkSync(videoResume.filePath);
    }

    // Delete from database
    await VideoResume.findByIdAndDelete(id);

    res.json({ message: "Video resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting video resume:", error);
    res.status(500).json({ error: "Failed to delete video resume" });
  }
});

module.exports = router; 