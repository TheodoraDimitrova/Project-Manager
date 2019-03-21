const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const expressValidator = require("express-validator");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const hbs = require("express-handlebars");

const app = express();
app.use(expressValidator());



// Passport Config
require('./config/passport')(passport);


//Connection to DB
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(() => {
    err => console.log(err);
  });



app.engine(
  ".hbs",
  hbs({
    defaultLayout: "main",
    extname: ".hbs",
    partialsDir: [__dirname + "/views/partials"]
  })
);
app.set("view engine", ".hbs");
app.use(express.static(path.join(__dirname, "public")));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: require("./config/keys").secretOrKey,
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  if (req.isAuthenticated()) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.is_admin = (req.user.role === "admin") ? true : false;
  }
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/admin',require("./routes/admin.js"))




const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
