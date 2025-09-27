const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { User } = require("../models");

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

    req.session.userId = user.id;
    req.flash("success", "Logged in successfully!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Server error, please try again");
    res.redirect("/auth/login");
  }
};

exports.register = async (req, res) => {
  try {
    //what is the type of req.body ?
    // the type of req.body is an object that contains the form data submitted by the user during registration.
    const { email, password, displayName, currency } = req.body;

    if (!email || !password || !displayName || !currency) {
      // Delete uploaded file if validation fails
      // unlinkSync is a synchronous method to delete a file
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


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {

    if (!email) {
      return res.render('forgot-password', {
        emailError: 'Email is required!',
        showCodeStep: false,  // khass code input ykoun hidden
        email: ''
      });
    }


    const user = await User.findOne({ where: { email } });
    if (!user) {

      // Email not found → render page with error
      req.flash('error', 'Email not found!');
      return res.render('auth/forgot-password', {
        showCodeStep: false,  // khass code input ykoun hidden
        success_msg: req.flash('success'),
        error_msg: req.flash('error'),
        email: ''
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if sendMail utility exists
    try {
      const { sendResetCode } = require("../utils/sendMail.js");

      const sent = await sendResetCode(email, resetCode);

      if (!sent) {
        req.flash("error", 'Filed te send email');
        return res.render('auth/forgot-password', {
          showCodeStep: false,
          success_msg: [],
          error_msg: req.flash('error'),
          email: ''
        });
      }

      return res.render('auth/forgot-password', {
        showCodeStep: true,
        resetCode ,
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
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    req.flash("success", "Logged out successfully");
    res.redirect("/auth/login");
  });
};


