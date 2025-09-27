// utils/sendMail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or any SMTP provider
  port: 587,
  secure: false, // true if port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// function to send reset code
const sendResetCode = async (toEmail, code) => {
  try {
    const info = await transporter.sendMail({
      from: `"FinSolution" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset Code",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Password Reset Code</h2>
        <p>Your password reset code is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${code}</p>
        <p>It will expire in 30 seconds.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>`,
    });

    return true; // success
  } catch (error) {
    return false; // failed
  }
};

module.exports = { sendResetCode };
