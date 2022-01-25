const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

module.exports = {
    //note from 1/13/22: changed the access and refresh tokens and it went from giving us req.body to giving us nothing at all. Just ran the 'something went wrong' err code. So I need to work on those. It's broken even at the local hosting level. For app.post('/send')
    sendForm: async (req,res) => {
        const {userEmail, userMessage, userName} = req.body
        console.log(req.body)
        //not getting body or console logging it at all. Need to get req.body.
      
        const myOAuth2Client = new OAuth2 (
          process.env.CLIENT_ID,
          process.env.CLIENT_SECRET,
          'https://developer.google.com/oauthplayground'
        )
      
          myOAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
          })
      
        const accessToken = myOAuth2Client.getAccessToken()
        
      
        const transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              type: 'OAuth2',
              user: process.env.EMAIL, 
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refresh_token: process.env.REFRESH_TOKEN,
              accessToken: accessToken,
            },
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
      //not console logging the message either, prob because it's not getting req.body.
      
      transporter.verify((err, success) => {
        err
          ? console.log(err)
          : console.log(`=== Server is ready to take messages: ${success} ===`);
      
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
    },
    //For app.get('/send')
    getForm: async (req,res) => {
        res.sendFile(process.cwd())
    },
}