const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { createAccessToken } = require("../utils/token.js");

// 🟢 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/auth/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/auth/login");
    }

    const accessToken = createAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    });

    req.session.userId = user.id;
    req.session.displayName = user.displayName;
    req.flash("success", "Logged in successfully!");
    res.redirect("/dashboard");

  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Server error, please try again");
    res.redirect("/auth/login");
  }
};

// 🟢 Register
exports.register = async (req, res) => {
  try {
    const { email, password, displayName, currency } = req.body;

    if (!email || !password || !displayName || !currency) {
      if (req.file) fs.unlinkSync(req.file.path);
      req.flash("error", "All fields are required");
      return res.redirect("/auth/register");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      req.flash("error", "Email already in use");
      return res.redirect("/auth/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const picturePath = req.file ? path.join("uploads", req.file.filename) : null;

    await User.create({
      email,
      password: hashedPassword,
      displayName,
      currency,
      picture: picturePath,
    });

    req.flash("success", "Account created successfully! Please login.");
    res.redirect("/auth/login");

  } catch (err) {
    console.error("Register error:", err);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fsErr) {
        console.error("Error deleting file:", fsErr);
      }
    }
    req.flash("error", "Server error, please try again");
    res.redirect("/auth/register");
  }
};

// 🟢 Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.render('auth/forgot-password', {
        emailError: 'Email is required!',
        showCodeStep: false,
        email: ''
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('error', 'Email not found!');
      return res.render('auth/forgot-password', {
        showCodeStep: false,
        success_msg: req.flash('success'),
        error_msg: req.flash('error'),
        email: ''
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const { sendResetCode } = require("../utils/sendMail.js");
      const sent = await sendResetCode(email, resetCode);

      if (!sent) {
        req.flash("error", 'Failed to send email');
        return res.render('auth/forgot-password', {
          showCodeStep: false,
          success_msg: [],
          error_msg: req.flash('error'),
          email: ''
        });
      }

      return res.render('auth/forgot-password', {
        showCodeStep: true,
        resetCode,
        success_msg: ['Reset code sent to your email'],
        error_msg: [],
        email
      });

    } catch (mailError) {
      req.flash("error", `Mail sending error: ${mailError}`);
      return res.render('auth/forgot-password', {
        showCodeStep: false,
        success_msg: [],
        error_msg: req.flash('error'),
        email: ''
      });
    }

  } catch (err) {
    req.flash("error", `Server error, ${err.message}`);
    res.status(500).render('auth/forgot-password', {
      emailError: 'Server error, please try again',
      success_msg: req.flash('success'),
      error_msg: req.flash('error'),
      showCodeStep: false,
      email: ''
    });
  }
};

// 🟢 Reset Password
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/auth/forgot-password");
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  req.flash("success", "Password reset successfully");
  res.redirect("/auth/login");
};

// 🟢 Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('accessToken');
    req.flash("success", "Logged out successfully");
    res.redirect("/auth/login");
  });
};
