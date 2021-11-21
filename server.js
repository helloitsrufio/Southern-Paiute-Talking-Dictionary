//Brings express into the app
const express = require('express')
const app = express()
// const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const cloudinary = require('cloudinary').v2

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'SouthernPaiute'
    PORT = process.env.PORT || 8000
      // databaseName = process.env.databaseName
      // username = process.env.username
      // password = process.env.password
      // cluster = process.env.cluster


// mongoose.connect(
// `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${databaseName}?retryWrites=true&w=majority`, {useNewUrlParser: true})
//     .then(client => {
//         console.log(`Connected to ${dbName} Database`)
//         db = client.db(dbName)
//   })

MongoClient.connect(dbConnectionStr, { useUnifiedTopology : true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    // .catch((err) =>{
    //   console.error("Failure to connect: ", err.message, err.stack)
    // })

//Using EJS for views
app.set("view engine", "ejs");

//Body Parsing
app.use(express.static('views'))//lets you use files in your public folder
app.use(express.urlencoded({ extended : true}))//method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
app.use(express.json())//method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.static('views'));

//Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
})

//Home Page

//Search Results Page
app.get("/", async (req, res) => {
    res.render('homePage.ejs')

    let { searchResult } = await req.query;
    const regex = new RegExp(searchResult, "gi");
    try {
      const dictionaryDB = await db
        .collection("SouthernPaiute")
        .find({
           result: { $regex: regex } 
        })
        .toArray();
      console.log(dictionaryDB);
      if (dictionaryDB.length) {
        return res.render("searchResults.ejs", { searchQueryResults: dictionaryDB });
      }
      return res.render("searchResults.ejs", { searchQueryResults: null });
    } catch (err) {
      console.error(err);
    }
    //POST /:resource_type/explicit
    //explicit used for already uploaded media
    //cloudinary.v2.uploader.explicit(public_id, options, callback);

  });
// app.get('/search', (req, res) =>  {
//   getResult: async (req,res) => {
//       try {
//           const results = await Result.findbyId({req.params.id})
//           .then((data) => {
//               if (!data) {
//                   return res.status(404).send({
//                       message: "Sorry, that result can't be found."
//                   })
//               }
//           })
//       }
//   }
//   db.collection('SouthernPaiute').find({}, { projection: {_id:}}).toArray()
//   .then(data => {
//       console.log(data)
//       res.render('searchResults.ejs', { info: data })
// //   })
//   .catch(error => console.error(error))
// })

// Specific Results Page
// app.get('/:id', (req,res) =>{
//     db.collection('SouthernPaiute').find().toArray()
//     .then(data => {
//         console.log(data)
//         res.render('wordPage.ejs', { info: data })
//     })
//     .catch(error => console.error(error))
//   })


//About Page
app.get('/about', (req,res) =>{
    res.render('aboutPage.ejs')
    if(err){console.log(error)}
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

app.post('/addEntry', async (req,res) =>{
  try {
    const result = await cloudinary.uploader.upload(req.file.path)
    await db.collection("SouthernPaiute").insertOne(
      {wordInput: req.body.wordInput, audioInput: req.body.audioInput, phoneticInput: req.body.phoneticInput, grammaticalInput: req.body.grammaticalInput, translationInput: req.body.translationInput, exampleInput: req.body.exampleInput, })
      //to be fixed
      cloudinary.v2.uploader.upload("/home/sample.jpg", 
        function(error, result) {console.log(result, error); });
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
  }catch (err) {
    console.log(err)
  }
  
  })




app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
