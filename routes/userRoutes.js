const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { Transaction } = require('../models')

router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    // Get messages and CLEAR them immediately
    const success_msg = req.session.messages?.success || [];
    const error_msg = req.session.messages?.error || [];

    if (req.session.messages) {
      delete req.session.messages.success;
      delete req.session.messages.error;
    }

    // Fetch categories
    const categories = await Category.findAll({
      where: { userId: req.session.user.id }
    });

    const transactions = await Transaction.findAll({
      where: { userId: req.session.user.id }
    });
    // i want to calculate the balance here
    // sum all the amounts in transactions
    // if type is expense, subtract from balance
    let balance = 0;

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
      displayName: req.session.user.displayName,
      categories: categories || [],
      transactions: transactions || [],
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
      success_msg: [],
      error_msg: ['Error fetching data']
    });
  }
});

module.exports = router;