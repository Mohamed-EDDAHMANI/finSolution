const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    // Handle login
    res.render('auth/login', { error: null });;
});

router.get('/register', (req, res) => {
    // Handle registration
});

module.exports = router;
