const adminList = [
  "ruthreed.dev@gmail.com",
  "speakpaiute@gmail.com",
];

module.exports = {
  ensureAuth: function (req, res, next) {
    //req.session.passport.user !== undefined
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureWhitelist: function (req, res, next) {
    if (adminList.includes(req.user.email)) {
      return next();
    } else {
      // TODO: Make an error page saying that you don't have permissions to access this page.
      res.redirect("/");
    }
  },
  isAdmin: function (email) {
    return email ? !!adminList.includes(email) : false;
  },
};
