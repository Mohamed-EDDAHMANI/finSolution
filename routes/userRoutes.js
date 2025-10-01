const express = require('express');
const router = express.Router();
const { Category } = require('../models');

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

    res.render('dashboard/home', {
      displayName: req.session.user.displayName,
      categories: categories || [],
      success_msg: success_msg,
      error_msg: error_msg
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.render('dashboard/home', { 
      displayName: 'Guest',
      categories: [], 
      success_msg: [],
      error_msg: ['Error fetching data'] 
    });
  }
});

module.exports = router;