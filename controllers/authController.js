const fs = require("fs");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { sendMail, resetPasswordTemplate } = require('../utils/sendMail');



// Helper to set session messages
const setSessionMessage = (req, type, messages, callback) => {
  req.session.messages = req.session.messages || {};
  req.session.messages[type] = Array.isArray(messages) ? messages : [messages];
  console.log('Set session messages:', req.session.messages);

  // Auto-save session after setting message
  req.session.save((err) => {
    if (err) {
      console.error('Session save error in setSessionMessage:', err);
    }
    if (callback) callback(err);
  });
};

// Helper to get and clear session messages
const getSessionMessage = (req, type) => {
  const msgs = (req.session.messages && req.session.messages[type]) || [];
  if (req.session.messages) delete req.session.messages[type];
  return msgs;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      setSessionMessage(req, 'error', 'Invalid email or password', () => {
        res.redirect("/auth/login");
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      setSessionMessage(req, 'error', 'Invalid email or password', () => {
        res.redirect("/auth/login");
      });
      return;
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      currency: user.currency,
      picture: user.picture
    };

    console.log('User logged in successfully:', user.email);
    setSessionMessage(req, 'success', 'Logged in successfully!', () => {
      res.redirect("/dashboard");
    });

  } catch (err) {
    console.error("Login error:", err);
    setSessionMessage(req, 'error', 'Server error, please try again', () => {
      res.redirect("/auth/login");
    });
  }
};

// 🟢 Register
exports.register = async (req, res) => {
  try {
    const { email, password, displayName, currency } = req.body;

    // التحقق من البيانات المطلوبة
    if (!email || !password || !displayName || !currency) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); }
        catch (fsErr) { console.error("File deletion error:", fsErr); }
      }
      setSessionMessage(req, 'error', 'All fields are required', () => {
        res.redirect("/auth/register");
      });
      return;
    }

    // التحقق من قوة كلمة المرور
    if (password.length < 6) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); }
        catch (fsErr) { console.error("File deletion error:", fsErr); }
      }
      setSessionMessage(req, 'error', 'Password must be at least 6 characters', () => {
        res.redirect("/auth/register");
      });
      return;
    }

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (req.file) {
        try { fs.unlinkSync(req.file.path); }
        catch (fsErr) { console.error("File deletion error:", fsErr); }
      }
      setSessionMessage(req, 'error', 'Email already in use', () => {
        res.redirect("/auth/register");
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const picturePath = req.file ? `uploads/${req.file.filename}` : null;

    const newUser = await User.create({
      email,
      password: hashedPassword,
      displayName,
      currency,
      picture: picturePath,
    });

    console.log('New user created:', newUser.id);
    setSessionMessage(req, 'success', 'Account created successfully! Please login.', () => {
      res.redirect("/auth/login");
    });

  } catch (err) {
    console.error("Register error:", err);
    if (req.file) {
      try { fs.unlinkSync(req.file.path); }
      catch (fsErr) { console.error("File deletion error:", fsErr); }
    }
    setSessionMessage(req, 'error', 'Server error, please try again', () => {
      res.redirect("/auth/register");
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.render('auth/forgot-password', {
        showCodeStep: false,
        email: '',
        success_msg: [],
        error_msg: ['Email is required!']
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('auth/forgot-password', {
        showCodeStep: false,
        success_msg: [],
        error_msg: ['Email not found!'],
        email: ''
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await sendMail(user.email, "Password Reset Code", resetPasswordTemplate(resetCode));

      // Store reset code in session
      req.session.resetCode = resetCode;
      req.session.resetEmail = email;
      req.session.resetCodeExpiry = Date.now() + 30000; // 30 seconds

      return res.render('auth/forgot-password', {
        showCodeStep: true,
        resetCode,
        success_msg: ['Reset code sent to your email'],
        error_msg: [],
        email
      });
    } catch (mailError) {
      console.error("Mail sending error:", mailError);
      return res.render('auth/forgot-password', {
        showCodeStep: false,
        success_msg: [],
        error_msg: ['Failed to send email'],
        email: ''
      });
    }

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.render('auth/forgot-password', {
      showCodeStep: false,
      success_msg: [],
      error_msg: ['Server error, please try again'],
      email: ''
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      setSessionMessage(req, 'error', 'All fields are required', () => {
        res.redirect("/auth/forgot-password");
      });
      return;
    }

    if (password !== confirmPassword) {
      setSessionMessage(req, 'error', 'Passwords do not match', () => {
        res.redirect("/auth/forgot-password");
      });
      return;
    }

    if (password.length < 6) {
      setSessionMessage(req, 'error', 'Password must be at least 6 characters', () => {
        res.redirect("/auth/forgot-password");
      });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      setSessionMessage(req, 'error', 'User not found', () => {
        res.redirect("/auth/forgot-password");
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    setSessionMessage(req, 'success', 'Password reset successfully! Please login.', () => {
      res.redirect("/auth/login");
    });

  } catch (err) {
    console.error('Reset password error:', err);
    setSessionMessage(req, 'error', 'Server error, please try again', () => {
      res.redirect("/auth/forgot-password");
    });
  }
};

// Logout - بس نمسح الـ session
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect("/auth/login");
  });
};