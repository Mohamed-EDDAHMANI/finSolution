const express = require('express');
const router = express.Router();

router.get('/healthz', (_req, res) => res.status(200).send('ok'));

module.exports = router;
