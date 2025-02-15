const express = require("express");
const authorize = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-Only Route
router.get("/admin-panel", authorize(["admin"]), (req, res) => {
    res.json({ message: "Welcome to the Admin Panel!" });
});

// Teacher-Only Route
router.get("/teacher-grades", authorize(["teacher"]), (req, res) => {
    res.json({ message: "Welcome to the Teacher Grade Panel!" });
});

// Student-Only Route
router.get("/student-grades", authorize(["student"]), (req, res) => {
    res.json({ message: "Here are your grades!" });
});

module.exports = router;
