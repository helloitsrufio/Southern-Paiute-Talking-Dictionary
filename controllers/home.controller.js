const { isAdmin } = require("../middleware/auth");

module.exports = {
  getHomePage: (req, res) => {
    res.render("homePage.ejs", {
      user: req.user,
      admin: isAdmin(req?.user?.email),
    });
  },
};
