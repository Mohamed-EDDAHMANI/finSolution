// ============================
// 1. IMPORTS
// ============================
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models'); 
const session = require("express-session");
const flash = require("connect-flash");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const authMiddleware = require("./middleware/authMiddleware");
const path = require('path');
const cookieParser = require('cookie-parser');

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


// ============================
// 2. SESSION CONFIGURATION
// ============================ 
// Initialize app BEFORE using any middleware
const app = express();
const PORT = process.env.PORT || 3000;
// Create session store instance to allow sync
const sessionStore = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, 
      httpOnly: true,
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});


// ============================
// 2. APP CONFIGURATION
// ============================ 

// static files
app.use(express.static(path.join(__dirname, 'public')));

// JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// Lightweight request logger to help debug hanging requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} in ${ms}ms`);
  });
  next();
});

// Auth middleware for all request
// app.use(authMiddleware.isAuth);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// ============================
// 3. ROUTES
// ============================
// Main routes
app.use('/', indexRoutes);

// Auth routes
app.use('/auth', authRoutes);

app.use('/dashboard', userRoutes);

// Static uploads (optional if you want to serve uploaded pictures)
app.use('/uploads', express.static(__dirname + '/uploads'));


// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).render('notfound');
});


// ============================
// 4. DATABASE CONNECTION
// ============================
(async () => {
  try {
    await sequelize.authenticate();

    if (process.env.DB_SYNC_ALTER === 'true') {
      await sequelize.sync({ alter: true });
      console.log('✅ DB synced with alter');
    }

    // Ensure session table exists
    await sessionStore.sync();

    console.log('✅ DB connection OK');
  } catch (err) {
    console.error('❌ DB connection failed, server still running:', err.message);
  }
})();




// ============================
// 5. SERVER START
// ============================
const startServer = async () => {
  // await connectDB();

  app.listen(PORT,  () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
