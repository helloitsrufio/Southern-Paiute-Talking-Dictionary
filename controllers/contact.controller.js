const { isAdmin } = require("../middleware/auth");

module.exports = {
  //Contact Page: app.get('/contact')
  contact: async (req, res) => {
    res.render("contactPage.ejs", {
      admin: isAdmin(req?.user?.email),
    });
  },
};
