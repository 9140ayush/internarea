const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const User = require("../Model/User");
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload avatar to Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { radius: 'max' } // Make it circular
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// Fallback upload function for when Cloudinary is not configured
const uploadToBase64 = async (file) => {
  const base64 = file.buffer.toString('base64');
  const mimeType = file.mimetype;
  return {
    secure_url: `data:${mimeType};base64,${base64}`
  };
};

// Middleware to get user from Firebase UID or JWT
const getUserFromAuth = async (req, res, next) => {
  try {
    const firebaseUid = req.headers['x-firebase-uid'];
    const userId = req.headers['x-user-id'];
    
    if (!firebaseUid && !userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    let user;
    if (firebaseUid) {
      user = await User.findOne({ firebaseUid });
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      // For demo purposes, create a user if not found
      if (firebaseUid) {
        user = await User.create({
          firebaseUid,
          name: 'Demo User',
          email: 'demo@example.com',
          avatarType: 'google'
        });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Upload profile image
router.post("/upload", getUserFromAuth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if Cloudinary is configured
    let result;
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("Cloudinary not configured, using base64 fallback");
      result = await uploadToBase64(req.file);
    } else {
      // Upload to Cloudinary
      result = await uploadToCloudinary(req.file);
    }
    
    // Update user's profile image in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: result.secure_url,
        avatarType: 'uploaded'
      },
      { new: true }
    );

    res.json({
      success: true,
      profileImage: result.secure_url,
      displayImage: updatedUser.displayImage,
      message: "Profile image uploaded successfully"
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({ error: "Failed to upload profile image", details: error.message });
  }
});

// Generate DiceBear avatar
router.post("/generate-dicebear", getUserFromAuth, async (req, res) => {
  try {
    const { seed, style = 'avataaars' } = req.body;
    
    if (!seed) {
      return res.status(400).json({ error: "Seed is required" });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    
    // Update user's profile image in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: avatarUrl,
        avatarType: 'dicebear'
      },
      { new: true }
    );

    res.json({
      success: true,
      profileImage: avatarUrl,
      displayImage: updatedUser.displayImage,
      message: "DiceBear avatar generated successfully"
    });
  } catch (error) {
    console.error("DiceBear avatar generation error:", error);
    res.status(500).json({ error: "Failed to generate avatar" });
  }
});

// Get user profile data
router.get("/profile", getUserFromAuth, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        profileImage: user.profileImage,
        displayImage: user.displayImage,
        avatarType: user.avatarType,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile data" });
  }
});

// Update user profile
router.put("/profile", getUserFromAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        email: email || req.user.email,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
        profileImage: updatedUser.profileImage,
        displayImage: updatedUser.displayImage,
        avatarType: updatedUser.avatarType
      },
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Delete profile image
router.delete("/profile-image", getUserFromAuth, async (req, res) => {
  try {
    // Update user to remove profile image (fall back to Google photo)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage: null,
        avatarType: 'google'
      },
      { new: true }
    );

    res.json({
      success: true,
      displayImage: updatedUser.displayImage,
      message: "Profile image removed successfully"
    });
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({ error: "Failed to remove profile image" });
  }
});

module.exports = router; 