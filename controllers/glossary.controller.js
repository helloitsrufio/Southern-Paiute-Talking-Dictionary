const EntryModel = require("../models/entry-model");
const { compareFunctions } = require("../utils/compareFunctions");

module.exports = {
  getGlossary: async (req, res) => {
    let name = req.query;
    const results = await EntryModel.search(name);

    res.render("glossary.ejs", {
      entry: name,
      entryList: results.sort(compareFunctions)
    });
  },
};
