const express = require("express");
const User = require("../Model/User");
const router = express.Router();

// Create or update user from Firebase auth
router.post("/sync", async (req, res) => {
  try {
    const { firebaseUid, name, email, photoURL } = req.body;
    
    if (!firebaseUid || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find existing user or create new one
    let user = await User.findOne({ firebaseUid });
    
    if (user) {
      // Update existing user
      user = await User.findByIdAndUpdate(
        user._id,
        {
          name,
          email,
          photoURL,
          lastLogin: Date.now(),
          isActive: true
        },
        { new: true }
      );
    } else {
      // Create new user
      user = await User.create({
        firebaseUid,
        name,
        email,
        photoURL,
        avatarType: 'google'
      });
    }

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
        firebaseUid: user.firebaseUid
      }
    });
  } catch (error) {
    console.error("User sync error:", error);
    res.status(500).json({ error: "Failed to sync user data" });
  }
});

// Get user by Firebase UID
router.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
        firebaseUid: user.firebaseUid
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
});

module.exports = router; 