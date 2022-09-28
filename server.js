require("dotenv").config({ path: "./config/.env" });
//Brings express into the app
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const connectDB = require("./config/database");
const fileUpload = require("express-fileupload");
const entryRoutes = require("./routes/entry.route");
const mainRoutes = require("./routes/main.route");
const authRoutes = require("./routes/auth.route");
let PORT = process.env.PORT || 8000;
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

require("./config/passport")(passport);

app.use(connectLiveReload());
//Connect to DB
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Body Parsing for Static Folder
app.use(express.static("public")); //lets you use files in your public folder

app.use(express.urlencoded({ extended: true })); //method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(express.json()); //method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(cors({ origin: "*" }));
//file upload for audio
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Setup Sessions - stored in MongoDB; Do I need this?
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
//So what app.use('/searchResults', entryRoutes) does is tell express to let requests that start with /searchResults to be handled by entryRoutes
app.use("/", entryRoutes);
app.use("/auth", authRoutes);

//Server running
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
