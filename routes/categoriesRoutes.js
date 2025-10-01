const express = require('express');
const router = express.Router();
const { validate, isRequired, minLength, isAlphabetic, isNumber, isPositive } = require('../validation-lib');
const categories = require('../controllers/categoryController');



router.post('/create',
    validate({
        name: [isRequired(), isAlphabetic(), minLength(3)],
        limit: [isRequired(), isNumber(), isPositive()]
    } , '/dashboard'),  (req, res) => {
        categories.createCategory(req, res);
    });

router.get('/get', (req, res) => {
    const result = categories.getCategories(req, res);
    // console.log('--------||||',result);
    res.json({ success: true, data: result });
});








module.exports = router;