function isAuth(req, res, next) {
  // Protected paths that need authentication
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings',
  ];

  // Check if the current path is protected
  const isProtected = protectedPaths.some(path => req.path.startsWith(path));

  if (isProtected) {
    // Check session only if it's a protected path
    if (!req.session.user) {
      console.log('User not authenticated, redirecting to login');
      req.session.messages = req.session.messages || {};
      req.session.messages.error = ['You must be logged in to access this page.'];
      return res.redirect("/auth/login");
    }
    console.log('User authenticated:', req.session.user.email);
  }

  // If not protected, or if authenticated, continue
  next();
}

module.exports = { isAuth };
