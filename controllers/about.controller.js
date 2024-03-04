const { isAdmin } = require("../middleware/auth");
module.exports = {
  //About Page: app.get('/about')
  about: async (req, res) => {
    res.render("aboutPage.ejs", {
      admin: isAdmin(req?.user?.email),
    });
  },
};
