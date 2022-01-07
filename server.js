require('dotenv').config()
 
//Brings express into the app
const express = require('express')
// const fs = require('fs')
const app = express()
const cors = require('cors')
const nodemailer = require('nodemailer')
const multiparty = require('multiparty')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
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
app.use(cors({ origin: "*"}))
//look into this and explain it: npmjs.com/package/express-fileupload
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
  app.get('/searchResults', (req,res) =>{
    let name = req.query.search;
    db.collection('SouthernPaiute').find({
      //returning full result and using translationInput as the search parameter
      //.* = anything. So by putting the name in the middle, you're looking for anything with that in it.
            translationInput: {$regex: new RegExp(`.*${name}.*`,'gi')}}).toArray()
    .then(data => {
        res.render('searchResults.ejs', {searchQueryResults: data, searchQuery: name})
    })
    .catch(error => console.error(error))
  })

  //Get specific entry/word
  app.get('/word/:id', (req,res) =>{
    let name = req.params.id;
    try{
      db.collection('SouthernPaiute').findOne(
        {'_id':ObjectId(name)}).then(data => {
          res.render('wordPage.ejs', {searchQueryResults: data})
        })
    }
    catch(error){
      console.error(error)
    }
  })
 
 
//About Page
app.get('/about', (req,res) =>{
    res.render('aboutPage.ejs')
})
 
//Contact Page
app.get('/contact', (req,res) =>{
    res.render('contactPage.ejs')
})

app.post('/send', async (req,res) =>{

  const {userEmail, userMessage, userName} = req.body

  let testAccount = await nodemailer.createTestAccount();
  const myOAuth2Client = new OAuth2 (
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developer.google.com/oauthplayground'
  )

    myOAuth2Client.setCredentials({
      refreshToken:process.env.REFRESH_TOKEN
    })

  const myAccessToken = myOAuth2Client.getAccessToken()
  

  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL, 
        clientId,
        clientSecret,
        refreshToken,
        myAccessToken,
      }
      tls: {
        rejectUnauthorized: false
      }
  })

const message = {
  from: `${userName}`,
  to: 'speakpaiute@gmail.com',
  subject: `Sent from: ${userEmail}`,
  text: `${userMessage}`,
};
console.log(message)

try{
  transporter.sendMail(message, (err,data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Something went wrong.");
    }else {
      res.status(200).send("Email successfully sent to recipient!");
    }
  });
} catch (err) {
    console.log(err)
}
})

app.get('/send', (req,res) =>{
  res.sendFile(process.cwd())
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
          if (err) res.send('err')
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