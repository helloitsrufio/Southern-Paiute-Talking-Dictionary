const cloudinary = require("../middleware/cloudinary");
const Entry = require("../models/Entry");

//equivalent of app.get('/searchResults')
module.exports = {
  getSearchResults: async (req, res) => {
    try {
      let name = req.query.search;
      await Entry.find({
          //returning full result and using translationInput as the search parameter
          //.* = anything. So by putting the name in the middle, you're looking for anything with that in it.
          translationInput: { $regex: new RegExp(`.*${name}.*`, "gi") },
        })
        .toArray()
        .then((data) => {
          res.render("searchResults.ejs", {
            searchQueryResults: data,
            searchQuery: name,
          });
        });
    } catch (error) {
      console.error(error);
    }
  },
  //Get specific entry/word: app.get(/word/:id)
  getID: async (req, res) => {
    let name = req.params.id;
    try {
      await Entry.findOne({ _id: ObjectId(name) })
        .then((data) => {
          res.render("wordPage.ejs", { searchQueryResults: data });
        });
    } catch (error) {
      console.error(error);
    }
  },
  // Equivalent of app.put('/updateEntry')
  //Note as of 1/20/22. I wasn't able to get this to work, though I did set up the update input page. I thought it would work, but it didn't because searchQueryResults is not defined. This is extremely confusing to me because it worked in the get request above and I did try to include it in the findOneAndUpdate. Maybe it doesn't work in the params in a put request, or just in the findOneAndUpdate? I'm not sure, but that's what I need to figure out.
  updateEntry: async (req, res) => {
    let name = req.params.id;
    try {
      await Entry.findOneAndUpdate(
          {
            _id: ObjectId(name).then((data) => {
              res.render("updateInputPage.ejs", { searchQueryResults: data });
            }),
          },
          {
            $set: {
              wordInput: req.body.wordInput,
              audioInput: newfileName,
              phoneticInput: req.body.phoneticInput,
              grammaticalInput: req.body.grammaticalInput,
              translationInput: req.body.translationInput,
              exampleInput: req.body.exampleInput,
            },
          },
          {
            upsert: false,
            returnDocument: "after",
          }
        )
        .then((data) => {
          res.render("updateInputPage.ejs", { searchQueryResults: data });
        });
    } catch (error) {
      console.error(error);
    }
  },
  //Input Page app.get('/input')
  getInputPage: async (req, res) => {
    res.render("inputPage.ejs");
  },
  //Update Input Page app.get('/update')
  updateInputPage: async (req, res) => {
    res.render("updateInputPage.ejs");
  },
  //Post entry app.post("/addEntry")
  addEntry: async (req, res) => {
    {
      let file = Array.isArray(req.files.audio)
        ? req.files.audio[0]
        : req.files.audio;
      if (["audio/wav", "audio/mp3"].includes(file.mimetype)) {
        const newfileName = `${new Date().getTime()}.${
          file.name.split(".")[1]
        }`;

        await cloudinary.uploader.upload(
          file.tempFilePath,
          {
            resource_type: "video",
            folder: "AudioUploads/",
            public_id: newfileName,
          },
          (err) => {
            if (err) res.send("err");
            try {
              Entry.insertOne({
                wordInput: req.body.wordInput,
                audioInput: newfileName,
                phoneticInput: req.body.phoneticInput,
                grammaticalInput: req.body.grammaticalInput,
                translationInput: req.body.translationInput,
                exampleInput: req.body.exampleInput,
              });
              res.redirect("/entryAdded");
            } catch (err) {
              console.log(err);
              res.send(err);
            }
          }
        );
      }
    }
  },
  //Entry added to db: app.get('/entryAdded')
  entryAdded: async (req, res) => {
    res.render("completedEntry.ejs");
  },
};
