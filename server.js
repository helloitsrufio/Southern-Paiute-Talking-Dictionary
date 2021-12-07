require('dotenv').config()
 
//Brings express into the app
const express = require('express')
const fs = require('fs')
const app = express()
const MongoClient = require('mongodb').MongoClient
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 
let db,
    dbName = 'SouthernPaiute'
    PORT = process.env.PORT || 8000
 
MongoClient.connect(process.env.DB_STRING, { useUnifiedTopology : true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    .catch((err) =>{
      console.error("Failure to connect: ", err.message, err.stack)
    })
 
//Using EJS for views
app.set("view engine", "ejs");
 
//Body Parsing
app.use(express.static('views'))//lets you use files in your public folder
app.use(express.urlencoded({ extended : true}))//method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
app.use(express.json())//method inbuilt in express to recognize the incoming Request Object as a JSON Object.
 
const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

//Home Page
app.get('/', (req,res) =>{
  res.render('homePage.ejs')
})
//Search Results Page
// app.get("/search", async (req, res) => {
//     res.render('searchResults.ejs')
 
//     let { searchResult } = await req.query;
//     const regex = new RegExp(searchResult, "gi");
//     try {
//       const dictionaryDB = await db
//         .collection("SouthernPaiute")
//         .find({
//            result: { $regex: regex } 
//         })
//         .toArray();
//       console.log(dictionaryDB);
//       if (dictionaryDB.length) {
//         return res.render("searchResults.ejs", { searchQueryResults: dictionaryDB });
//       }
//       return res.render("searchResults.ejs", { searchQueryResults: null });
//     } catch (err) {
//       console.error(err);
//     }
 
//   });

  app.get('/:id', (req,res) =>{
    let name = req.query.search;
    db.collection('SouthernPaiute').find({
            translationInput: {$regex: new RegExp(`.*${name}.*`,'gi')}}).toArray()
    //  { projection: {_id: 0, wordInput: 1, grammaticalInput: 1, translationInput: 1}}).toArray()
    .then(data => {
        console.log(req.query.search)
        res.render('searchResults.ejs', {searchQueryResults: data, searchQuery: name})
    })
    .catch(error => console.error(error))
  })

  app.get('/word:id', (req,res) =>{
    let name = req.query.id;
    console.log(req.query)
    db.collection('SouthernPaiute').find({
            _id: result})
    .then(data => {
        res.render('wordPage.ejs', {searchQueryResults: data, searchQuery: name})
    })
    .catch(error => console.error(error))
  })
 
 
//About Page
app.get('/about', (req,res) =>{
    res.render('aboutPage.ejs')
})
 
//Contact Page
app.get('/contact', (req,res) =>{
    res.render('contactPage.ejs')
})
 
//Alphabet Page
app.get('/alphabet', (req,res)=>{
    try {res.render('alphabetPage.ejs')
  }catch (err) {
    console.error(err);}
})
 
//Input Page
app.get('/input', (req,res)=>{
    res.render('inputPage.ejs')
})
 
app.post("/addEntry", async (req, res) => {
  let file = Array.isArray(req.files.audio) ? req.files.audio[0] : req.files.audio
  if (['audio/wav', 'audio/mp3'].includes(file.mimetype)) {
      const newfileName = `${new Date().getTime()}.${file.name.split('.')[1]}`

      await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: "video",
          folder: 'AudioUploads/',
          public_id: newfileName,
      }, err => {
          if (err) res.send(err)
          try {
              db.collection("SouthernPaiute").insertOne(
                  {
                      wordInput: req.body.wordInput,
                      audioInput: newfileName,
                      phoneticInput: req.body.phoneticInput,
                      grammaticalInput: req.body.grammaticalInput,
                      translationInput: req.body.translationInput,
                      exampleInput: req.body.exampleInput,
                  })
              res.redirect('/entryAdded');
          } catch(err){
              console.log(err)
              res.send(err)
          }

      })
  }
});
 
app.get('/entryAdded', (req,res)=>{
  res.render('completedEntry.ejs')
})
 
 
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})