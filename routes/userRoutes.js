const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { Transaction } = require('../models')
const { Budget } = require('../models')
const { Op, fn, col, literal } = require("sequelize");
const moment = require("moment");

router.get('/', async (req, res) => {
  let balance = 0;
  let transactions = [];
  let budgets = [];
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    // Get messages and CLEAR them immediately
    const success_msg = req.session.messages?.success || [];
    const error_msg = req.session.messages?.error || [];

    if (req.session.messages && (req.session.messages.success || req.session.messages.error)) {
      delete req.session.messages.success;
      delete req.session.messages.error;
    }

    // Fetch Data for the dashboard
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const categories = await Category.findAll({
      where: { userId: req.session.user.id },
      attributes: [
        "id",
        "name",
        "limit",
        [fn("COALESCE", fn("SUM", col("Transactions.amount")), 0), "currentTotal"],
      ],
      include: [
        {
          model: Transaction,
          attributes: [],
          where: {
            date: { [Op.between]: [startOfMonth, endOfMonth] }
          },
          required: false,
        }
      ],
      group: ["Category.id"],
    });

    const transactions = await Transaction.findAll({
      where: { userId: req.session.user.id }
    });

    budgets = await Budget.findAll({
      where: { userId: req.session.user.id },
      include: [{ model: Category, attributes: ["id", "name"] }]
    });
    // i want to calculate the balance here
    // sum all the amounts in transactions
    // if type is expense, subtract from balance

    if (Array.isArray(transactions)) {
      transactions.forEach(trx => {
        const amount = Number(trx.amount); // convert string to number
        if (isNaN(amount)) {
          console.warn('Montant invalide pour la transaction:', trx);
          return; // ignore invalid amounts
        }

        if (trx.type === 'expense') {
          balance -= amount;
        } else {
          balance += amount;
        }
      });
    }


    res.render('dashboard/dashboard', {
      user: req.session.user,
      categories: categories || [],
      transactions: transactions || [],
      budgets: budgets || [],
      balance: balance || 0,
      success_msg: success_msg,
      error_msg: error_msg
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.render('dashboard/dashboard', {
      displayName: 'Guest',
      categories: [],
      balance: balance || 0,
      budgets: budgets || [],
      transactions: transactions || [],
      success_msg: [],
      error_msg: ['Error fetching data']
    });
  }
});

module.exports = router;