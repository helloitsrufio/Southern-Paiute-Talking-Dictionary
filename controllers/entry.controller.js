const cloudinary = require("../middleware/cloudinary");
const Entry = require("../models/Entry");
const EntryModel = require("../models/entry-model");
// const fileUpload = require('express-fileupload');
// const { ObjectId } = require("mongodb");


//equivalent of app.get('/searchResults')
module.exports = {
  getSearchResults: async (req, res) => {
    let name = req.query.search;

    const results = await EntryModel.search(name);

    res.render("searchResults.ejs", {
      searchQuery: name,
      searchQueryResults: results,
    });
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

  updateInputPage: async (req, res) => {
    let name = req.params.id;
    // console.log(req)
    // console.log('test')
    // let downloadURL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/v1643929264/AudioUploads/${audioInput}`
  
    console.log(req.params.id)
    // console.log(downloadURL)
    try {
      const data = await Entry.findOne({ _id: name })
      res.render("editWord.ejs", { result: data });
    } catch (error) {
      console.error(error);
    }
  },

  // Equivalent of app.put('/updateEntry')
  updateEntry: async (req, res) => {

      const name = req.params.id;

      const files = req.files;
      let audio = undefined;
      if (files) {
        audio = files.audio;
      }

      const file = Array.isArray(audio)
        ? audio[0]
        : audio;
      
      
      if (file == undefined) {
        // UPDATE WITHOUT NEW AUDIO FILE
        console.log("No audio in request, updating mongoDB only");
        Entry.findOneAndUpdate(
          {
            _id: name,
          },
          {
            wordInput: req.body.wordInput,
            phoneticInput: req.body.phoneticInput,
            grammaticalInput: req.body.grammaticalInput,
            translationInput: req.body.translationInput,
            exampleInput: req.body.exampleInput,
          }
        ).then((result) => {
          console.log("mongo result: ", result);
          res.redirect("/entryAdded")
        });
      } else if (["audio/wav", "audio/mp3", "audio/mpeg"].includes(file.mimetype)) {
        console.log("New audio found!");
        const newfileName = new Date().toISOString();
        console.log(newfileName);

        try{
          // await cloudinaryUpload(file.tempFilePath)

          await cloudinary.uploader.upload(
            file.tempFilePath,
            {
              resource_type: "video",
              folder: "AudioUploads/",
              public_id: newfileName,
            },
          );
          
          // Get the existing MongoDB document
          // const existingEntry.previousAudioID = await Entry.findOne()
          // [Step: Unicorn] Get the old audioID from the existing mongoDB document, save in variable.
          
          // UPload new audio file.
          // Update existing mongoDB document

          // Finally call cloudinary.uploader.destroy() to delete old audio file with ID we saved in step Unicorn.
          
          const result = await Entry.findOneAndUpdate(
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
          )
          console.log("mongo result: ", result);
          res.redirect("/entryAdded")
        } catch (error) {
          res.status(500).json({
            message: 'Internal server error. Issue with MongoDB or Cloudinary',
            errorMsg: error?.message,
            errorObj: JSON.stringify(error),
          })
        }

      } else {
        console.warn('Mimetype not supported.',file.mimetype)
        res.status(400).json({message: 'Failed to add item; bad mimetype'})
      }
  },

  //Input Page app.get('/input')
  getInputPage: async (req, res) => {
    res.render("inputPage.ejs",{errorMessage: ''});
  },

  //Post entry app.post("/addEntry")
  addEntry: async (req, res) => {
    let file = Array.isArray(req.files.audio)
      ? req.files.audio[0]
      : req.files.audio;

    if (!["audio/wav", "audio/mpeg"].includes(file.mimetype)) {
      res.render("inputPage.ejs", {errorMessage: 'The type of audio file provided is not allowed.'});
      return;
    }

    const uploadedFile = await cloudinaryUpload(file.tempFilePath)
    const { public_id } = uploadedFile;

    const entry = {
      wordInput: req.body.wordInput,
      audioInput: public_id,
      phoneticInput: req.body.phoneticInput,
      grammaticalInput: req.body.grammaticalInput,
      translationInput: req.body.translationInput,
      exampleInput: req.body.exampleInput,
    }
    console.log({entry})

    await Entry.create(entry);
    
    res.redirect("/entryAdded");
  },
  
  //Entry added to db: app.get('/entryAdded')
  entryAdded: async (req, res) => {
    res.render("completedEntry.ejs");
  },

  getID: async (req, res) => {
    let name = req.params.id;
    const entry = {};
    try {
      await Entry.findOne({ _id: name }).then((data) => {
        res.render("wordPage.ejs", { searchQueryResults: data });
      });
    } catch (error) {
      console.error(error);
    }
  },

  //delete entry
  deleteEntry: async (req, res) => {
    // query from database to get the public_id
    // delete from database
    // delete from cloudinary (public_id)
    let name = req.params.id;

    let entry = await Entry.findOne({ _id: name })
    console.log({ entry })

    let public_id = entry.audioInput
    console.log("delete", { public_id });
    
    console.log(await cloudinaryDestroy(public_id));

    console.log(await Entry.deleteOne({ _id: name }));

    res.redirect('/');
  },

  // deleteEntryCallbackHell: (req, res) => {
  //   let name = req.params.id;
  //   Entry.findOne({ _id: name }).then(entry => {
  //     let public_id = entry.audioInput
  //     cloudinary.v2.uploader.destroy(public_id, (err, data) => {
  //       if (err) {
  //         return res.send(err);
  //       }
  //       Entry.deleteOne({ _id: name }).then(() => {
  //         res.redirect('/');
  //       })
  //     });
  //   })
  // },
};

function cloudinaryDestroy(public_id) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, {
      resource_type: "video"
    }, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    })
  })
}

function cloudinaryUpload(filepath) {
  const uuid = new Date().toISOString();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filepath,
      {
        resource_type: "video",
        public_id: `AudioUploads/${uuid}`,
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      }
    )
  })
}
