// middlewares/authMiddleware.js
exports.isAuth = (req, res, next) => {
  const publicPaths = ['/', '/auth/login', '/auth/register']; // public routes
  if (publicPaths.includes(req.path)) {
    console.log("Public path, skipping auth check");
    return next(); // skip auth check
  }

  if (!req.session.userId) {
    return res.redirect('/auth/login'); // not logged in
  }

  return next(); // logged in, continue
};
