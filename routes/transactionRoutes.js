const express = require('express');
const router = express.Router();
const { validate, isRequired, minLength, isAlphabetic, isNumber, isPositive } = require('../validation-lib');
const transactionController = require('../controllers/transactionController');



router.post('/create',
    validate({
        type: [isRequired(), isAlphabetic(), minLength(3)],
        categoryId: [isRequired(), isNumber()],
        amount: [isRequired(), isNumber(), isPositive()],
        date: [isRequired()]
    } , '/dashboard'),  (req, res) => {
        transactionController.createTransaction(req, res);
    });

router.get('/get', (req, res) => {
    const result = transaction.getTransactions(req, res);
    res.json({ success: true, data: result });
});

router.put('/update/:id', transactionController.updateTransaction);

router.delete('/delete/:id', transactionController.deleteTransaction);

module.exports = router;









module.exports = router;