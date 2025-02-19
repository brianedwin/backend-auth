const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authorize = (allowedRoles) => {
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        try {
            // Check if session is valid
            const session = await db.query("SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()", [token]);
            if (session.rows.length === 0) return res.status(401).json({ message: "Session expired" });

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Fetch user role
            const user = await db.query("SELECT role FROM users WHERE id = $1", [decoded.userId]);
            if (!user.rows.length) return res.status(401).json({ message: "User not found" });

            // Check if role is allowed
            if (!allowedRoles.includes(user.rows[0].role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            next(); // 🔹 Ensure next() is called!
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = authorize;
