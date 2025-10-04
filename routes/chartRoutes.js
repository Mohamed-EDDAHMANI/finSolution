// routes/chartRoutes.js
const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/db");
const { Transaction } = require("../models");
const { Category } = require("../models");

router.get("/data", async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Dépenses par catégorie
    const categoriesData = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: ['categoryId', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      include: [{ model: Category, attributes: ["name"] }],
      group: ['categoryId']
    });

    // Dépenses et revenus par mois
    const monthlyData = await Transaction.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['month', 'type'],
      order: [['month', 'ASC']]
    });

    res.json({ categoriesData, monthlyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: "Erreur lors de la récupération des données" });
  }
});

module.exports = router;
