const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        text: `Click the link to verify your email: ${process.env.FRONTEND_URL}/verify/${email}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
