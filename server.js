// ============================
// 1. IMPORTS ------
// ============================
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Database & Models
const { sequelize } = require("./models");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const transactionsRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const chartRoutes = require("./routes/chartRoutes");


// ============================
// 2. INITIALIZATION
// ============================
const app = express();
const PORT = process.env.PORT || 3000;


// ============================
// 3. SESSION 
// ============================
const sessionStore = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1h
      httpOnly: true,
    },
  })
);


// ============================
// 4. APP CONFIGURATION
// ============================

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Auth middleware applied globally
app.use(authMiddleware.isAuth);

// Attach user to all views
app.use(authMiddleware.attachUser);


// ============================
// 5. ROUTES
// ============================

// Main routes
app.use("/", indexRoutes);

// Auth routes
app.use("/auth", authRoutes);

// User dashboard routes
app.use("/dashboard", userRoutes);

// API routes
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes );
app.use("/api/budgets", budgetRoutes );
app.use("/api/charts", chartRoutes );

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 Handler
app.use((req, res) => {
  res.status(404).render("notfound");
});


// ============================
// 6. DATABASE CONNECTION
// ============================
(async () => {
  try {
    await sequelize.authenticate();

    if (process.env.DB_SYNC_ALTER === "true") {
      await sequelize.sync({ alter: true });
      console.log("✅ DB synced with alter");
    }

    // Ensure session table exists
    await sessionStore.sync();
    console.log("✅ Session store synced");

    console.log("✅ DB connection OK");
    startServer();
  } catch (err) {
    console.error("❌ DB connection failed, server still running:", err.message);
  }
})();


// ============================
// 7. START SERVER
// ============================
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

