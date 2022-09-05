const Entry = require("./Entry");

module.exports.search = async (name) => {
  const results = await Entry.find({
    //returning full result and using translationInput as the search parameter
    //.* = anything. So by putting the name in the middle, you're looking for anything with that in it.
    translationInput: { $regex: new RegExp(`.*${name}.*`, "gi") },
  })
  return results;
}