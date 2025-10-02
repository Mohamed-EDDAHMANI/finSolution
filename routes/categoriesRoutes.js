const express = require('express');
const router = express.Router();
const { validate, isRequired, minLength, isAlphabetic, isNumber, isPositive } = require('../validation-lib');
const categoryController = require('../controllers/categoryController');


// --- Create Category
router.post('/create',
    validate({
        name: [isRequired(), isAlphabetic(), minLength(3)],
        limit: [isRequired(), isNumber(), isPositive()]
    } , '/dashboard'),  (req, res) => {
        categoryController.createCategory(req, res);
    });

// --- Get Categories
router.get('/get', (req, res) => {
    const result = categoryController.getCategories(req, res);
    // console.log('--------||||',result);
    res.json({ success: true, data: result });
});

// --- Update Category
router.put(
  '/update/:id',
  validate({
    name: [isRequired()],
    limit: [isRequired(), isNumber(), isPositive()]
  }),
  (req, res) => {
    categoryController.update(req, res);
  }
);

// --- Delete Category
router.delete('/delete/:id', (req, res) => {
    console.log('helllo from delete route');
  categoryController.remove(req, res);
});







module.exports = router;