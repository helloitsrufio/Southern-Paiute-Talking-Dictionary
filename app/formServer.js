const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const multiparty = require('multiparty')
require('dotenv').config()

//PORT
const PORT = process.env.PORT || 5000

// Express
// instantiate an express app
const app = express()

//cors
app.use(cors({ origin: "*"}))//WHAT DOES THIS DO
app.use('/public', express.static(process.cwd() + '/public'))//THIS MAKES PUBLIC STATIC BUT WHAT DOES THAT DO. 

//make the contact page the the first page on the app. This is the static HTML
app.route('/contact').get(function (req, res) {
    res.sendFile(process.cwd() + '/public/contactPage.html')
});