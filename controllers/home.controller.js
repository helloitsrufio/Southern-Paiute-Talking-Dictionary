module.exports = {
  getHomePage: (req, res) => {
    res.render("homePage.ejs", { user: req.user });
  },
};
