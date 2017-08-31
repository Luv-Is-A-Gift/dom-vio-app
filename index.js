const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.resolve(__dirname, 'public');
const data = require('./data.js');
const fetch = require('node-fetch');

const userData = data.userData;
const logData = data.logData;

var app = express();
var deckId;

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'dom vio', cookie: { maxAge: 300000 }}));



//TEMP AUTH. Need auth to discern whether auth user or auth admin---------------
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

// NEED TO TEST. Only pull user information of session user
function matchUser(req, username, password) {
  var match = userData.findOne(function (user) {
    if (username === user.username) {
      return userData.user
    } else {
      console.log('SORRY: user not found')
      return;
    }
  })
}



// REQUESTS*--------------------------------------------------------------------
// -----------------------------------------------------------------------------
app.get('/', function(req, res) {
  req.session.authenticated = false;
  res.render('cards');
});

app.post('/shuffle', function(req, res) {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  .then(function(response){
    return response.json();
  })
  .then(function(json){
    if (json.shuffled === true) {
    console.log(json);
    req.session.deckId = json.deck_id;
    };
  res.render('cards', {results:json});
  });
});

app.post('/drawCard', function(req, res) {
  fetch('https://deckofcardsapi.com/api/deck/' + req.session.deckId + '/draw/?count=1')
  .then(function(response) {
    return response.json();
  })
  .then(function(json){
    res.render('cards', {cardResults:json})
    console.log("prints drawCard json", json);
  });
});

// LOGIN------------------------------------------------------------------------
// NOTE:
// 1)Hitting "back" from /user after logging in will flag error of "Cannot GET /login"
// This is set up so that it will just take them back to '/' and avoid error.
// '/' will log them out and quit their session. (safety measure? can change later.)
app.get('/login', function (req,res) {
  res.redirect('/');
})

app.post('/login', function (req, res) {
    let username = req.body.loginName;
    let password = req.body.loginPassword;
    authenticate(req, username, password);
    if (req.session && req.session.authenticated) {
      console.log('user authenticated!')
      req.session.user = username;
      res.redirect('/user');
    } else {
      //NOTE: We discussed having incorrect user login information lead you to a game / "under construction" page (for cover).
      // This can be added later.
      console.log('Invalid login information, try again please.')
      res.render('login')
    };
});

// SIGNUP-----------------------------------------------------------------------
// NOTE:
// --when sign-up is submitted: user added to db + sent back to login  route('/')
// sign up currently includes first name, last name, username, email, password

app.post('/signup', function(req, res) {

  // function to add user/ create user instance

  res.redirect('/')
});

// ****USER ROUTES--------------------------------------------------------------
// USER HOME--------------------------------------------------------------------
// NOTE:
// -adjust home view to include Quick Access feature (?)
    // Quick Access feature includes what?:
        // Quick Log (create new: timestamp + status only)
            // button > pop up form > button yellow = unsafe  button red= incident
        // Call 911 (call only)
            // Auto call 911, should also quick log "red/ incident"
        // Quick Contact Trusted Person (call? text?)
            // Auto text/ call person on file, should also quick log "yellow/ unsafe" or "red/ incident"
// -TODO: add navigation to '/user-information'  navigation to '/user-logs'

app.get('/user', function(req, res) {
  if (req.session.authenticated === true) {
  res.render('user-home', {username: req.session.user})
} else {
  res.redirect('/');
}
});

// USER-INFORMATION (ROUTE '/user/user-info')-----------------------------------
// -personal-information form should be optional.
app.get('/user-info/', function(req, res) {
  if (req.session.authenticated === true) {

  // TODO:attempt function matchUser

  res.render('user-information', {userData: userData});
  } else {
    res.redirect('/');
  }
});

// ****ADMIN ROUTES-------------------------------------------------------------
// ADMIN HOME-------------------------------------------------------------------
app.get('/admin', function(req, res) {
  res.render('admin-home', {
    // username: adminUsername,
    userData
  })
});


//SHOWS ALL LOGS----------------------------------------------------------------
// TODO: create user-log for user route-----------------------------------------
app.get('/log', function(req, res) {
  if (req.session.authenticated === true) {
    res.render('log',
    {
      logData
    })
  } else {
    res.redirect('/');
  }
});



app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("success: dom vio app up on port 5000");
});
