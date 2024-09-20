const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
      res.status(401).json({ message: 'You need to log in to access this resource.' });
    } else {
      next();
    }
  };
  
  module.exports = withAuth;