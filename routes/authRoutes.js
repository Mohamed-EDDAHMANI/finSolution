const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middleware/upload");
const { validate, isRequired, isEmail, minLength } = require("../validation-lib");

// GET routes - with flash message support
router.get('/login', (req, res) => {
  const success_msg = req.session.messages?.success || [];
  const error_msg = req.session.messages?.error || [];

  // Clear messages after reading
    if (req.session.messages && (req.session.messages.success || req.session.messages.error)) {
      delete req.session.messages.success;
      delete req.session.messages.error;
    }

  
  res.render('auth/login', { 
    success_msg,
    error_msg
  });
});

router.get('/register', (req, res) => {
  const success_msg = req.session.messages?.success || [];
  const error_msg = req.session.messages?.error || [];
  
  // Clear messages after reading
  if (req.session.messages && (req.session.messages.success || req.session.messages.error)) {
    delete req.session.messages.success;
    delete req.session.messages.error;
  }
  
  res.render('auth/register', { 
    success_msg,
    error_msg
  });
});

// POST routes with validation
router.post('/login', 
  validate({
    email: [isRequired('Email is required'), isEmail('Please enter a valid email')],
    password: [isRequired('Password is required')]
  }),
  authController.login
);

router.post('/register', 
  upload.single('picture'),
  validate({
    displayName: [isRequired('Name is required'), minLength(2, 'Name must be at least 2 characters')],
    email: [isRequired('Email is required'), isEmail('Please enter a valid email')],
    password: [isRequired('Password is required'), minLength(6, 'Password must be at least 6 characters')],
    currency: [isRequired('Currency is required')]
  }),
  authController.register
);

router.get('/forgot-password', (req, res) => {
  const success_msg = req.session.messages?.success || [];
  const error_msg = req.session.messages?.error || [];
  
  // Clear messages after reading
  if (req.session.messages) {
    delete req.session.messages.success;
    delete req.session.messages.error;
  }
  
  res.render('auth/forgot-password', {
    showCodeStep: false,
    success_msg,
    error_msg,
    email: ''
  });
});

router.post('/forgot-password', 
  validate({
    email: [isRequired('Email is required'), isEmail('Please enter a valid email')]
  }),
  authController.forgotPassword
);

router.post('/resetPassword', 
  validate({
    email: [isRequired('Email is required')],
    password: [isRequired('Password is required'), minLength(6, 'Password must be at least 6 characters')],
    confirmPassword: [isRequired('Please confirm your password')]
  }),
  authController.resetPassword
);

router.post('/logout', authController.logout);

module.exports = router;