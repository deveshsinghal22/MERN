let middlewares = {
  isLoggedIn : (req, res, next) => {
    if (req.session && typeof req.session.user !== 'undefined') {
      next();
    } else {
      res.sendStatus(401);
      res.end();
    }
  },
  isAdmin : (req, res, next) => {
    if (req.session && typeof req.session.user !== 'undefined' && req.session.user.isAdmin) {
      next();
    } else {
      res.sendStatus(401);
      res.end();
    }
  }
};

module.exports = middlewares;