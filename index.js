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
app.use(express.static('public'));
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'dom vio', cookie: { maxAge: 300000 }}));

//Temp Auth. Drag this into sep js
function authenticate(req, username, password) {
   console.log('authenticating');
   var authenticatedUser = userData.find(function (user) {
    if (username === user.username && password === user.password) {
      return req.session.authenticated = true;
      console.log('User & Password Pass Authentication!');
    } else {
      console.log('Unauthorized!');
      return req.session.autheticated = false;
      res.redirect('/login');
     }
   });
   console.log(req.session);
   return req.session;
}

app.get('/', function(req, res) {
  req.session.authenticated = false;
  res.render('login');
});

// works. delete after dynamic route
// app.post('/login', function (req, res) {
//     let username = req.body.loginName;
//     let password = req.body.loginPassword;
//     authenticate(req, username, password);
//     if (req.session && req.session.authenticated) {
//       console.log("you are authenticated!");
//       res.render('user-home', {username: username})
//     } else {
//       console.log('dangit. try again please')
//       res.render('login');
//     };
// });




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

app.get('/user-information', function(req, res) {
  res.render('user-information');
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
