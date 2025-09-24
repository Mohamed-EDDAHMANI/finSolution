const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    // Handle login
    //   console.log('User login attempt');
    res.status(200).send('Login page. Use POST /auth/login to authenticate.');
});

router.get('/register', (req, res) => {
    // Handle registration
});

module.exports = router;
