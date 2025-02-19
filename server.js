const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

require("dotenv").config();
require("./config/passport");

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";  // Allows external access

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));

