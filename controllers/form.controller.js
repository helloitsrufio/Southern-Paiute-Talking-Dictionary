const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
module.exports = {
  sendForm: async (req, res) => {
    const { userEmail, userMessage, userName } = req.body;

    const myOAuth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developer.google.com/oauthplayground"
    );

    myOAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const transporter = nodemailer.createTransport({
      // service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2", //not capitalized in docs, should it be?
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = {
      from: `${userName}`,
      to: "speakpaiute@gmail.com",
      subject: `Sent from: ${userEmail}`,
      text: `${userMessage}`,
    };
    console.log(message);

    transporter.verify((err, success) => {
      err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);

      try {
        transporter.sendMail(message, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send("Something went wrong.");
          } else {
            res.status(200).send("Email successfully sent to recipient!");
          }
        });
      } catch (err) {
        console.log(err);
      }
    });
  },
  //For app.get('/send')
  getForm: async (req, res) => {
    res.sendFile(process.cwd());
  },
};
