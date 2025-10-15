// Helper to set session messages with auto-save
const setSessionMessage = (req, type, messages, callback) => {
  req.session.messages = req.session.messages || {};
  req.session.messages[type] = Array.isArray(messages) ? messages : [messages];
  
  req.session.save((err) => {
    if (err) {
      console.error('Session save error in authMiddleware:', err);
    }
    if (callback) callback(err);
  });
};

function isAuth(req, res, next) {
  // Define path categories
  const protectedPaths = ['/dashboard', '/profile', '/settings', '/api'];
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const publicPaths = ['/', '/about', '/contact'];

  const isAuthenticated = !!(req.session && req.session.user);
  const currentPath = req.path;

  // Check if current path requires authentication
  const requiresAuth = protectedPaths.some(path => currentPath.startsWith(path));
  
  // Check if current path is auth-related (login/register)
  const isAuthPage = authPaths.some(path => currentPath.startsWith(path));

  // ============================
  // CASE 1: Protected routes - require authentication
  // ============================
  if (requiresAuth) {
    if (!isAuthenticated) {
      console.log('🔒 Access denied - Authentication required:', currentPath);
      
      // For API requests, return JSON error
      if (currentPath.startsWith('/api')) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }
      
      // For web requests, redirect to login with message
      setSessionMessage(req, 'error', 'You must be logged in to access this page.', () => {
        res.redirect('/auth/login');
      });
      return;
    }
    
    console.log('✅ Authenticated user accessing protected route:', req.session.user.email);
    return next();
  }

  // ============================
  // CASE 2: Auth pages (login/register) - redirect if already authenticated
  // ============================
  if (isAuthPage) {
    if (isAuthenticated) {
      console.log('↪️ Already authenticated, redirecting to dashboard:', req.session.user.email);
      return res.redirect('/dashboard');
    }
    
    console.log('🔓 Unauthenticated user accessing auth page:', currentPath);
    return next();
  }

  // ============================
  // CASE 3: Public routes - allow everyone
  // ============================
  console.log('🌐 Public route access:', currentPath);
  next();
}

// Middleware to attach user to res.locals for all views
function attachUser(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!(req.session && req.session.user);
  next();
}

// Middleware to require authentication (use in specific routes)
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    console.log('🔒 Authentication required');
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    setSessionMessage(req, 'error', 'Please login to continue.', () => {
      res.redirect('/auth/login');
    });
    return;
  }
  
  next();
}

module.exports = { isAuth, attachUser, requireAuth };
