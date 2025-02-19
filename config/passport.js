const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");
const crypto = require("crypto");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await db.query("SELECT * FROM users WHERE email = $1", [profile.emails[0].value]);

                if (!user.rows.length) {
                    // Generate a random password (Google users don't need it)
                    const randomPassword = crypto.randomBytes(16).toString("hex");

                    // Insert user with a random password
                    user = await db.query(
                        "INSERT INTO users (email, password, role, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING *",
                        [profile.emails[0].value, randomPassword, "student"]
                    );
                }

                return done(null, user.rows[0]);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
