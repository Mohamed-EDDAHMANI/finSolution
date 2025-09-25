const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => res.send('FinSolutions API is running.....'));

module.exports = router;
