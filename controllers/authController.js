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

exports.logout = (req, res) => {
  req.session.destroy(() => {
    req.flash("success", "Logged out successfully");
    res.redirect("/auth/login");
  });
};
