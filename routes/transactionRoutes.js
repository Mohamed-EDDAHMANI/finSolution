const express = require('express');
const router = express.Router();
const { validate, isRequired, minLength, isAlphabetic, isNumber, isPositive } = require('../validation-lib');
const transaction = require('../controllers/transactionController');



router.post('/transaction',
    validate({
        type: [isRequired(), isAlphabetic(), minLength(3)],
        category: [isRequired(), isAlphabetic(), minLength(3)],
        amount: [isRequired(), isNumber(), isPositive()],
        date: [isRequired()]
    } , '/dashboard'),  (req, res) => {
        transaction.createTransaction(req, res);
    });

router.get('/get', (req, res) => {
    const result = transaction.getTransactions(req, res);
    res.json({ success: true, data: result });
});








module.exports = router;