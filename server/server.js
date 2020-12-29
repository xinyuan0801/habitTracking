// const url = "mongodb+srv://Admin:123@cluster0.dwn5j.mongodb.net/csc301_project?retryWrites=true&w=majority";
'use strict';

const log = console.log
const express = require("express");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const bodyParser = require('body-parser')
const path = require("path");
const cors = require('cors');

//Intializing app
const app = express();
const fs = require("fs");

const accountRoutes = require("./routes/accountRoutes");
const habitRoutes = require("./routes/habitRoutes");
const userRoute = require("./routes/user")
const passport = require('passport')
const jwt = require('jsonwebtoken')


//middleware for parsing forms and storing result as json obj
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(cors());

app.use(express.static(path.join(__dirname, "/../", "client/build")));

// Use passport middleware
app.use(passport.initialize())
//Bring Strategy
require('./config/passport')(passport)

mongoose.connect("mongodb+srv://Admin:123@cluster0.dwn5j.mongodb.net/csc309_project?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>{
    log("Mongoose DB running")
  }).catch(error => {
    log(`Unable to connect with database ${error}`)
  })

/* <----- ROUTES ----- >*/
app.use(userRoute)

app.use(accountRoutes);
app.use(habitRoutes);

//Handle production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(__dirname + '/public/'))
}

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))


//Handle useNewUrlParser
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log('Backend running on port ' + port)
})
