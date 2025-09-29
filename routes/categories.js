const express = require('express');
const router = express.Router();
const { validate, isRequired, minLength, isAlphabetic, isNumber, isPositive } = require('../validation-lib');
const categories = require('../controllers/categoryController');

// router.post('/create', 
//     validate({
//         name: [isRequired(), isAlphabetic(), minLength(3)],
//         limit: [isRequired(), isNumber(), isPositive()]
// }), categories.createCategory);



router.post('/create',
    validate({
        name: [isRequired(), isAlphabetic(), minLength(3)],
        limite: [isRequired(), isNumber(), isPositive()]
    } , '/dashboard'), (req, res) => {
        console.log('here create categori logic  index.js loaded');
    });









module.exports = router;