// middleware/isAuth.js
function isAuth(req, res, next) {
  // Allow public paths (auth routes)
  if (req.path.startsWith('/auth')) {
    console.log('helo');
    return next();
  }

  // Check if user is logged in with session
  if (!req.session || !req.session.userId) {
    req.flash("error", "Please login first...");
    return res.redirect("/auth/login");
  }

  // User is authenticated → continue
  next();
}

module.exports = { isAuth };
