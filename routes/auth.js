const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const speakeasy = require("speakeasy");
const db = require("../config/db");
const sendVerificationEmail = require("../utils/email");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    const { email, password, role } = req.body;

    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email",
        [email, hashedPassword, role || "student"]
    );

    sendVerificationEmail(newUser.rows[0].email);

    res.json({ message: "Registration successful! Please verify your email." });
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    async (req, res) => {
        const token = jwt.sign({ userId: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    }
);

module.exports = router;
