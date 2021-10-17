//Brings express into the app
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectDB = require("./config/database");
const mainRoutes = require('./routes/app.routes')
const wordRoutes = require('./routes/word')
 

//Use .env file in config folder
require('dotenv').config({ path: "./config/.env" })

//Importing mongoose into app
const mongoose = require('mongoose');

//Connect to database
connectDB()

//Using EJS for views
app.set("view engine", "ejs");

//Body Parsing
app.use(express.urlencoded());
app.use(express.json());

//Simple GET route that returns a message that the server is running
app.get('/', (req, res) => {
    res.json({"message": 'Server is running.'})
});

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/word", wordRoutes);

//Listening to the port for incoming connections. 
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})


//for word routes
//app.use(wordRoutes)
