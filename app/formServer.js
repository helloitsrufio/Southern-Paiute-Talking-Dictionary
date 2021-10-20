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


const transporter = nodemailer.createTransport({//what does .createTransport() do?
    // host: 'smtp.gmail.com'
    service: 'gmail'
    // port: 587
    auth: {
      //YOU NEED TO FIGURE THIS PART OUT R
        user: process.env.EMAIL
        pass: process.env.PASS
    }
})

transporter.verify(function (error,success) {
    if (error) {
        console.log(error)
    }else {
        console.log('Server is ready to take our messages.')
    }
})

app.post('/send', (req,res) => {
    let form = new multiparty.Form()//what is a multiparty form?
    //making a data object
    let data = {}
    form.parse(req, function (err, fields) {
        console.log(fields)
        //what are keys in an obj?
        Object.keys(fields).forEach(function (property) {
          //Not entirely sure what is happening on this next line
            data[property] = fields[property].toString()
        })

        //configuring the object
        const mail = {
            sender: `${data.name} <${data.email}>`,
            to: process.env.EMAIL, //receiver email
            subject: data.subject
            text: `${data.name} <${data.email}> \n${data.message}`
        }
    })
})

app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
      console.log(fields);
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
  
      //2. You can configure the object however you want
      const mail = {
        from: data.name,
        to: process.env.EMAIL,
        subject: data.subject,
        text: `${data.name} <${data.email}> \n${data.message}`,
      };
  
      //3.
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Something went wrong.");
        } else {
          res.status(200).send("Email successfully sent to recipient!");
        }
      });
    });
  });

  //Express server listening.
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`)
  })