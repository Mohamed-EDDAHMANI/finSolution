const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { validate , isRequired , isInteger} = require("../validation-lib");

// CRUD
router.get("/",  budgetController.getBudgets);


router.post("/", validate({
    month: [isRequired(), isInteger()],
    amount: [isRequired(), isInteger()],
    categoryId: [isRequired(), isInteger()]
}), budgetController.createBudget);

router.put("/:id", validate({
    month: [isRequired(), isInteger()],
    amount: [isRequired(), isInteger()],
    categoryId: [isRequired(), isInteger()]
}), budgetController.updateBudget);

router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
