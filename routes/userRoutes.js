const express = require('express');
const router = express.Router();

const sessionDistroy = (req) => {
  // tmas7 session kamla
  if (req.session) {
    req.session.destroy(err => {
      if (err) console.log('Error destroying session:', err);
    });
  }
};


router.get('/', (req, res) => {
    res.locals.displayName = req.session.displayName || null;
    res.locals.success_msg = req.session.messages?.success || [];
    res.locals.error_msg = req.session.messages?.error || [];
    sessionDistroy(req)

    res.render('dashboard/home', { error: null, data: null });
});


module.exports = router;