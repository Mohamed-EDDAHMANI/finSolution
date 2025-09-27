const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
// Use centralized upload middleware (multer configured) 
const upload = require("../middleware/upload");
const { validate, isRequired, isEmail, minLength, isAlphabetic } = require('../validation-lib');


router.get('/login', (req, res) => {
    // Handle login
    res.render('auth/login', { error: null });
});
router.post('/login',
  validate({
    email: [isRequired('email is required'), isEmail()],
    password: [isRequired('password is required')]
  }), authController.login);


router.get('/register', (req, res) => {
    // Handle registration
    res.render('auth/register', { error: null });
    // return;
});

router.post("/register",
    upload.single("picture"),
    validate({
        displayName: [isRequired('name is required'), isAlphabetic('name must be alphabetic')],
        email: [isRequired('email is required'), isEmail()],
        password: [isRequired('password is required'), minLength(6, 'password must be at least 6 characters')],
        currency: [isRequired('currency is required')]
    }),
     authController.register);

router.get("/logout", authController.logout);
    
router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', {
    showCodeStep: false, // default: code step hidden
    email: '',           // empty by default
    emailError: null,
    codeError: null
  });
});

router.post('/forgot-password', authController.forgotPassword);

router.post('/resetPassword', authController.resetPassword);

module.exports = router;
