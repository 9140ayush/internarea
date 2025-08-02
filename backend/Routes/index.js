const express = require("express");
const router = express.Router();
const admin = require("./admin");
const intern = require("./internship");
const job = require("./job");
const application=require("./application");
const avatar = require("./avatar");
const user = require("./user");
const videoResume = require("./videoResume");

router.use("/admin", admin);
router.use("/internship", intern);
router.use("/job", job);
router.use("/application", application);
router.use("/avatar", avatar);
router.use("/user", user);
router.use("/video-resume", videoResume);

module.exports = router;
