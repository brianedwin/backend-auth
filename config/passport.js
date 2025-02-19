const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

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
                    // Create new user if not exists
                    user = await db.query(
                        "INSERT INTO users (email, password, role, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING *",
                        [profile.emails[0].value, null, "student"]
                    );
                }

                return done(null, user.rows[0]);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
