const { Budget, Category } = require("../models");

module.exports = {
  // Get all budgets of user
  async getBudgets(req, res) {
    try {
      const budgets = await Budget.findAll({
        where: { userId: req.session.user.id },
        include: [{ model: Category, attributes: ["id", "name"] }]
      });
      console.log(budgets);
      res.render("dashboard", {
        budgets,
        categories: await Category.findAll({ where: { userId: req.session.user.id } }),
        displayName: req.session.user.displayName,
      });
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Erreur lors du chargement des budgets");
      res.redirect("/dashboard");
    }
  },

  // Create budget
  async createBudget(req, res) {
    try {
      const { month, amount, categoryId } = req.body;

      if (!month || !amount || !categoryId) {
        return res.status(400).json({ errors: "Tous les champs sont requis" });
      }

      const budgetExists = await Budget.findOne({
        where: { month, userId: req.session.user.id, categoryId }
      });

      if (budgetExists) {
        return res.status(400).json({ errors: "Un budget existe déjà pour ce mois et cette catégorie" });
      }

      const budget = await Budget.create({
        month,
        amount,
        userId: req.session.user.id,
        categoryId
      });

      const budgetSend = await Budget.findOne({
        where: { id: budget.id },
        include: [{ model: Category, attributes: ["id", "name"] }]
      });

      res.status(201).json(budgetSend);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: "Erreur serveur lors de la création" });
    }
  },

  // Update budget
  async updateBudget(req, res) {
    try {
      const { id } = req.params;
      const { amount, month, categoryId } = req.body;
      console.log(req.body);

      const budget = await Budget.findOne({ where: { id, userId: req.session.user.id } });
      if (!budget) {
        return res.status(404).json({ errors: "Budget non trouvé" });
      }

      budget.amount = amount || budget.amount;
      budget.month = month || budget.month;
      budget.categoryId = categoryId || budget.categoryId;
      await budget.save();
      res.json(budget);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: "Erreur lors de la mise à jour" });
    }
  },

  // Delete budget
  async deleteBudget(req, res) {
    try {
      const { id } = req.params;
      const budget = await Budget.findOne({ where: { id, userId: req.session.user.id } });
      if (!budget) {
        return res.status(404).json({ errors: "Budget non trouvé" });
      }

      await budget.destroy();
      res.json({ message: "Budget supprimé" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: "Erreur lors de la suppression" });
    }
  }
};
