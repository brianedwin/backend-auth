const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const speakeasy = require("speakeasy");
const db = require("../config/db");
const sendVerificationEmail = require("../utils/email");

const router = express.Router();
