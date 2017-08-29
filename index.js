const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.resolve(__dirname, 'public');
const data = require('./data.js');

const userData = data.userData;
const logData = data.logData;

var app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
// app.use(express.static('public'));
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(session({ secret: 'dom vio', cookie: { maxAge: 300000 }}));

app.get('/', function(req, res) {
  // req.session.authenticated = false;
  res.render('home');
});

app.get('/admin', function(req, res) {
  // if (req.session.authenticated === true) {
    res.render('admin', {userData: userData})
  // } else {
  //   res.redirect('/');
  // }
});

// -----------------------------------------------------------------------------
app.get('/signup', function(req, res) {
    res.render('signup')
});

// -----------------------------------------------------------------------------
  // sign up should include first name, last name, username, email, password
  // on sumbit:
        // -send user to personal info form (app.get('/your-info')  (?))
        // -disclaimer before ^ or before V
        // -form will require them to enter: home address, primary phone number, DOB
        // -form will give them the option to add additional info (addl addresses, addl names to keep on file)
app.post('/sign-up', function(req, res) {
  // -add user to db

  // -dynamic params for user
  // -send them 'home' but render user-information form?
  // when this is submitted, the home view will be visible instead. (can avoid having to redirect this way). can change later
  // res.redirect('/:username/home')

  // NOTE: maybe user-information form can just be a modal that requires sumbit before user is able to exit out of it...
          // on the home page, instead of having to redirect like below.
  res.redirect('/user-information');
})

// -----------------------------------------------------------------------------
app.get('/log', function(req, res) {
  // const logData = data.logData;
  // if (req.session.authenticated === true) {
    res.render('log',
    {
      logData
    })
  // } else {
  //   res.redirect('/');
  // }
});

// -----------------------------------------------------------------------------
app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("success: dom vio app up on port 5000");
});




// *** intentional whitespace ***
