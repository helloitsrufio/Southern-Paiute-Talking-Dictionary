//Brings express into the app
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'SouthernPaiute'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology : true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    .catch((err) =>{
      console.error("Failutre to connect: ", err.message, err.stack)
    })

//Using EJS for views
app.set("view engine", "ejs");

//Body Parsing
app.use(express.static('public'))//lets you use files in your public folder
app.use(express.urlencoded({ extended : true}))//method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
app.use(express.json())//method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.static('views'));

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
app.get('/:id', (req,res) =>{
    db.collection('SouthernPaiute').find().toArray()
    .then(data => {
        console.log(data)
        res.render('wordPage.ejs', { info: data })
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
    res.render('alphabetPage.ejs')
})

//Input Page
app.get('/input', (req,res)=>{
    res.render('inputPage.ejs')
})

// app.post('/input', (req,res) =>{

// })




const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
