const express = require('express');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const fetch = require('node-fetch');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// connection: dotenv + mongoose----------------------------------
const dotenv = require('dotenv').config();
const url = process.env.MONGOLAB_URI;

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});
var db = mongoose.connection;

// models + bcrypt for password hash-----------------------------
const Admin = require('./models/Admin.js')
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');

// app-----------------------------------------------------------
var app = express();
var deckId;

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'dom vio',
  cookie: { maxAge: 300000 },
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

const initPassport = require('./controllers/initializePassport.js');
initPassport(passport);

const routes = require('./controllers/routes.js');
app.use('/', routes);

// NOTE: remove if we cannot separate later. for now, place admin routes on routes.js
// const adminRoutes = require('./controllers/adminRoutes.js');
// app.use('/admin', adminRoutes);


app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("success: dom vio app up on port 5000");
});

// keep V
// app.listen(process.env.PORT || 7000, function(req, res) {
//   console.log("success: dom vio app up on port 7000");
// });
