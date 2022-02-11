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
    try {
      await Entry.findOne({ _id: name }).then((data) => {
        res.render("editWord.ejs", { result: data });
      });
    } catch (error) {
      console.error(error);
    }
  },
  // Equivalent of app.put('/updateEntry')
  //TODO: Want to try to use .save() mongoose method. first you have to find the item you want to update, once you get it you save it in a const and that variable has a save() function.
  //So maybe use the .findOne() that you used earlier and call the .save() on that variable.
  //Tried to do it below, original update code is commented out.
  updateEntry: async (req, res) => {
    let name = req.params.id;
    name.overwrite({
      wordInput: req.body.wordInput,
      audioInput: newfileName,
      phoneticInput: req.body.phoneticInput,
      grammaticalInput: req.body.grammaticalInput,
      translationInput: req.body.translationInput,
      exampleInput: req.body.exampleInput,
    });
    await name.save();
    // console.log(req.body.wordInput)
    // // let file = Array.isArray(req.files.audio) ?
    // // req.files.audio[0] :
    // // req.files.audio;
    // // if (["audio/wav", "audio/mp3"].includes(file.mimetype)) {
    // //   const newfileName = `${new Date().getTime()}`

    // //   await cloudinary.uploader.upload(
    // //     file.tempFilePath, {
    // //       resource_type: "video",
    // //       folder: "AudioUploads/",
    // //       public_id: newfileName,
    // //     },
    //     async (err, result) => {
    //       if (err) res.send("err");

    //       try {
    //         Entry.updateOne({
    //             _id: name
    //           }, {
    //             $set: {
    //               //supposed to have all of these in 'quotation marks' b/c of the documentation, but I didn't see it make a big difference.
    //               wordInput: req.body.wordInput,
    //               // audioInput: newfileName,
    //               phoneticInput: req.body.phoneticInput,
    //               grammaticalInput: req.body.grammaticalInput,
    //               translationInput: req.body.translationInput,
    //               exampleInput: req.body.exampleInput,
    //             },
    //           }, {
    //             upsert: false,
    //             returnDocument: "after",
    //           })
    //           // .then((data) => {
    //           //   res.redirect("/entryAdded")
    //           // })
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     }
    //   // )
    // // }
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
          (err, result) => {
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
