const cloudinary = require("../middleware/cloudinary");
const Entry = require("../models/Entry");
// const fileUpload = require('express-fileupload');
// const { ObjectId } = require("mongodb");

//equivalent of app.get('/searchResults')
module.exports = {
  //can't find certain entries. Can find some, like asdf or SOME fold-related entries, but can't find the rest of them in the db. Not sure what is making it so it finds some and not others. There are the entries that I made before I messed with the code, and then there are those that came after. I thought that all those that came after were unsearchable, but 'fold' (in database) is searchable and it came after...? Need to figure this out.
  getSearchResults: async (req, res) => {
    try {
      let name = req.query.search;
      await Entry.find({
        //returning full result and using translationInput as the search parameter
        //.* = anything. So by putting the name in the middle, you're looking for anything with that in it.
        translationInput: { $regex: new RegExp(`.*${name}.*`, "gi") },
      }).then((data) => {
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
      await Entry.findOne({ _id: name }).then((data) => {
        res.render("wordPage.ejs", { searchQueryResults: data });
      });
    } catch (error) {
      console.error(error);
    }
  },
  //Update Input Page app.get('/update-word/:id')
  updateInputPage: async (req, res) => {
    let name = req.params.id;
    console.log(req.params.id)
    try {
      await Entry.findOne({ _id: name }).then((data) => {
        res.render("editWord.ejs", { result: data });
      });
    } catch (error) {
      console.error(error);
    }
  },
  // Equivalent of app.put('/updateEntry')
  //TODO: Messed around with the params in .explicit(),and it just isn't fucking working. Getting err, but it is not descriptive. Sometimes it says that we are using the wrong type. Also, we hardcoded the params so that we could get this far; will need to fix that. Also we changed public_id from downloadURL to newFileName since it's the new uploaded one vs the one we are getting from Cloudinary.
  //Sorry if that doesn't make any sense. It doesn't to past Ruthie either. 
  updateEntry: async (req, res) => {
    {
      const name = req.params.id;
      let downloadURL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/v1643929264/AudioUploads/${req.body.audio}`
      let file = Array.isArray(req.files.audio)
        ? req.files.audio[0]
        : req.files.audio;
      if (["audio/wav", "audio/mp3", "audio/mpeg"].includes(file.mimetype)) {
        const newfileName = `${new Date().getTime()}`;
        await cloudinary.uploader.explicit(
          newfileName,
          {
            //public_id: downloadURL,
            type: "upload",
            invalidate: true,
          },
          {resource_type: "video",
          folder: "AudioUploads/",
          // public_id: newfileName
        },
          async (err) => {
            console.log(err.message)
            if (err) res.send("err");

            try {
              // if(req.files == null){
                Entry.findOneAndUpdate(
                  {
                    _id: name,
                  },
                  {
                    wordInput: req.body.wordInput,
                    phoneticInput: req.body.phoneticInput,
                    audioInput: newfileName,
                    grammaticalInput: req.body.grammaticalInput,
                    translationInput: req.body.translationInput,
                    exampleInput: req.body.exampleInput,
                  }
                );
              // }
              // .then((data) => {
              //   res.redirect("/entryAdded")
              // })
            } catch (error) {
              console.error(error);
            }
          }
        );
      }
    }
  },

  //Input Page app.get('/input')
  getInputPage: async (req, res) => {
    res.render("inputPage.ejs");
  },

  //Post entry app.post("/addEntry")
  addEntry: async (req, res) => {
    {
      let file = Array.isArray(req.files.audio)
        ? req.files.audio[0]
        : req.files.audio;
      if (["audio/wav", "audio/mp3"].includes(file.mimetype)) {
        const newfileName = `${new Date().getTime()}`;

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
              Entry.create({
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
