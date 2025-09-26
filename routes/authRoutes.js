const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
// Use centralized upload middleware (multer configured) 
const upload = require("../middleware/upload");


router.get('/login', (req, res) => {
    // Handle login
    res.render('auth/login', { error: null });
});
router.post('/login', authController.login);


router.get('/register', (req, res) => {
    // Handle registration
    res.render('auth/register', { error: null });
    // return;
});
// Register with picture upload
router.post("/register", upload.single("picture"), authController.register);

router.get("/logout", authController.logout);


module.exports = router;
