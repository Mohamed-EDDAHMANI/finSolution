const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middleware/upload");
const { validate, isRequired, isEmail, minLength, isAlphabetic } = require('../validation-lib');

// Helper to get and clear session messages
const getSessionMessage = (req, type) => {
  const msgs = (req.session.messages && req.session.messages[type]) || [];
  if (req.session.messages) delete req.session.messages[type];
  return msgs;
};

const sessionDistroy = (req) => {
  // tmas7 session kamla
  if (req.session) {
    req.session.destroy(err => {
      if (err) console.log('Error destroying session:', err);
    });
  }
};


// GET /login
router.get('/login', (req, res) => {
  const error = getSessionMessage(req, 'error')
  const success = getSessionMessage(req, 'success');
// hna khwi lia session mn dakchi li fiha 
sessionDistroy(red)
  res.render('auth/login', {
    error_msg: error,
    success_msg: success
  });
});

// POST /login
router.post('/login',
  validate({
    email: [isRequired('email is required'), isEmail()],
    password: [isRequired('password is required')]
  }),
  authController.login
);

// GET /register
router.get('/register', (req, res) => {
  res.render('auth/register', {
    error_msg: getSessionMessage(req, 'error'),
    success_msg: getSessionMessage(req, 'success')
  });
});

// POST /register
router.post("/register",
  upload.single("picture"),
  validate({
    displayName: [isRequired('name is required'), isAlphabetic('name must be alphabetic')],
    email: [isRequired('email is required'), isEmail()],
    password: [isRequired('password is required'), minLength(6, 'password must be at least 6 characters')],
    currency: [isRequired('currency is required')]
  }),
  authController.register
);

// GET /logout
router.get("/logout", authController.logout);

// GET /forgot-password
router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', {
    showCodeStep: false,
    email: '',
    emailError: null,
    codeError: null,
    success_msg: getSessionMessage(req, 'success'),
    error_msg: getSessionMessage(req, 'error')
  });
});

// POST /forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /resetPassword
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
