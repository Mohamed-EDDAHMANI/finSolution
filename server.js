// ============================
// 1. IMPORTS
// ============================
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models'); // DB connection

// Routes
const healthRoutes = require('./routes/health');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');

// ============================
// 2. APP CONFIGURATION
// ============================
const app = express();
const PORT = process.env.PORT || 3000;

// JSON parser
app.use(express.json());

// EJS setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// ============================
// 3. ROUTES
// ============================
// Main routes
app.use('/', indexRoutes);
app.use('/', healthRoutes);

// Auth routes
app.use('/auth', authRoutes);

// ============================
// 4. DATABASE CONNECTION
// ============================
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // adjust as needed
    console.log('✅ DB connection OK');
  } catch (err) {
    console.error('❌ DB connection failed (server will still start):', err.message);
  }
};

// ============================
// 5. SERVER START
// ============================
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
