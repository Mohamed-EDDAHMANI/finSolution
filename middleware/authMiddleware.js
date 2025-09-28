const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    req.flash("error", "Please login first");
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // نقدر نستعملو فـ controller
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    req.flash("error", "Session expired, please login again");
    return res.redirect("/auth/login");
  }
}

module.exports = { authMiddleware };
