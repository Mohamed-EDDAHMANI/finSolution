require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json());

const healthRoutes = require('./routes/health');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');

app.use('/', indexRoutes);
app.use('/', healthRoutes);
// app.use('/auth', authRoutes);
app.get('/auth/login', (_req, res) => res.status(200).send('Login page (server.js test)'));

// db connection import
const { sequelize } = require('./models');

// Start server after DB check (non-fatal if DB is not ready; adjust as you like)
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    console.log('DB connection OK');
  } catch (err) {
    console.error('DB connection failed (will still start server):', err.message);
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
})();