const express = require('express');
const router = express.Router();
const categories = require('./categoriesRoutes');




router.get('/', (_req, res) =>
  res.send('FinSolutions API is running..')
);





module.exports = router;
