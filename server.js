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

//Using EJS for views
app.set("view engine", "ejs");

//Body Parsing
app.use(express.static('public'))//lets you use files in your public folder
app.use(express.urlencoded({ extended : true}))//method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
app.use(express.json())//method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.static('views'));

//Home Page
app.get('/', (req, res) =>{
    res.render('homePage.ejs')
})

//Search Results Page
app.get('/search', (req, res) =>  {
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
  db.collection('SouthernPaiute').find({}, { projection: {_id:}}).toArray()
  .then(data => {
      console.log(data)
      res.render('searchResults.ejs', { info: data })
  })
  .catch(error => console.error(error))
})

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




const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
