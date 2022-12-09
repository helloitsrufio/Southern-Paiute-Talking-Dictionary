const { isAdmin } = require("../middleware/auth");

module.exports = {
  //Alphabet Page app.get('/alphabet'),
  alphabet: async (req, res) => {
    try {
      res.render("alphabetPage.ejs", {
        admin: isAdmin(req?.user?.email),
      });
    } catch (err) {
      console.error(err);
    }
  },
};
