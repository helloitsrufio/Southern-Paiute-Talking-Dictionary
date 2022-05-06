const cloudinary = require("../middleware/cloudinary");
const Entry = require("../models/Entry");
// const fileUpload = require('express-fileupload');
// const { ObjectId } = require("mongodb");

//equivalent of app.get('/searchResults')
module.exports = {
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
  //TODO:method is not running. We are trying to get the id of the audio so we can populate the form with the audio. 
  //In downloadURL we are trying to figure out what the last template literal should be. 
  //Update Input Page app.get('/update-word/:id')
  updateInputPage: async (req, res) => {
    let name = req.params.id;
    // console.log(req)
    // console.log('test')
    // let downloadURL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/v1643929264/AudioUploads/${audioInput}`
    
    console.log(req.params.id)
    // console.log(downloadURL)
    try {
      await Entry.findOne({ _id: name }).then((data) => {
        // console.log(data)
        res.render("editWord.ejs", { result: data, });
      });
    } catch (error) {
      console.error(error);
    }
  },
  // Equivalent of app.put('/updateEntry')
  
  updateEntry: async (req, res) => {
      // console.log("request.body: ", req.body);
      // console.log("request.params: ", req.params);
      // console.log("request.query: ", req.query);
      // console.log('request.files', req.files);

      const name = req.params.id;
      // console.log(req.files)
      // let downloadURL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/v1643929264/AudioUploads/${req.body.audio}`
 

      
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
        const newfileName = `${new Date().getTime()}`;
        console.log(newfileName);

        try{
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
