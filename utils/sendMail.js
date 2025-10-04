// utils/sendMail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true if port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * sendMail
 * @param {string} toEmail - recipient email
 * @param {string} subject - email subject
 * @param {string} htmlContent - email HTML body
 * @returns {boolean} success or failure
 */
const sendMail = async (toEmail, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"FinSolution" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Example template for reset password
const resetPasswordTemplate = (code) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2>Password Reset Code</h2>
    <p>Your password reset code is:</p>
    <p style="font-size: 24px; font-weight: bold; color: #007BFF;">${code}</p>
    <p>It will expire in 30 seconds.</p>
    <p>If you didn't request this, ignore this email.</p>
  </div>
`;


module.exports = { sendMail, resetPasswordTemplate };
