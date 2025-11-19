// Authentication Middleware - Check if user is logged in

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash('error', 'Please login to continue');
  res.redirect('/auth/login');
};

const isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
};

module.exports = { isAuthenticated, isGuest };
