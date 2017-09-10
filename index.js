const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.resolve(__dirname, 'public');
const fetch = require('node-fetch');

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

app.post('/card2login', function(req, res) {
  // req.session.authenticated = true;
  res.render('login-signup');
});

//USER LOGIN--------------------------------------------------------------------
app.get('/login', function (req,res) {
  res.render('login-signup');
})

app.post('/login', function (req, res) {
    let username = req.body.loginName;
    let password = req.body.loginPassword;
    User.findOne({ username: username }, function(err, user) {
      if (user && bcrypt.compareSync(password, user.password)) {
         console.log('YOU SHALL PASS: ' + user)
        //  req.session.authenticated = true;
        //  req.session.user = user;
         req.session.username = username;
        return req.session.authenticated = true;
      } else {
        return req.session.authenticated = false;
      }
      return req.session;
    }).then(user => {
      if (req.session && req.session.authenticated) {
        console.log('YOU SHALL PASS')
        res.redirect('/user/' + user.username);
      } else {
        console.log('try again')
        res.redirect('/login');
      }
  });
});

//USER SIGNUP-------------------------------------------------------------------
app.post('/signup', function(req, res) {
   var newUser = new User(
     {
       dateOfBirth: req.body.dob,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       username: req.body.username,
       password: req.body.password1,
       phone_number: req.body.phone,
       homeAddress: req.body.streetAddress + " " + req.body.addressLine2 + " " + req.body.inputCity + " " + req.body.inputState + " " + req.body.inputZip,
       homeAddressInfo: req.body.details,
     }
   );
   newUser.save(function(err, user) {
      if (err) {
        console.log("Oh no! Error: ", err);
      }
      console.log("User Added! Go check mlab!", user);
   });

  res.redirect('/login');
});

app.get('/signup', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username);
  } else {
    res.redirect('/login');
  }
});

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
// view
app.get('/user/:username', function(req, res) {
  if (req.session.authenticated === true) {
  res.render('user-home', {username: req.params.username});
} else {
  res.redirect('/login');
}
});

// USER-INFORMATION (ROUTE '/user/user-info')-----------------------------------
app.get('/user/:username/user-info/', function(req, res) {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.params.username })
    .then(function(user) {
      res.render('user-information', {
        user: user,
        safety_contact: user.safety_contact
      });
    });
  } else {
    res.redirect('/login');
  }
});

// add safety contact // W *
app.post('/addSafetyContact', function(req, res) {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.username })
    .then(function(user) {
      user.safety_contact.push({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        relationshipToUser: req.body.relationship,
        email: req.body.email,
        phone_number: req.body.phone,
      });
      user.save().then(function(user) {
        res.redirect('/user/' + user.username + '/user-info/');
      });
    }).catch(function(err) {
      res.send(err)
    });
  } else {
    res.redirect('/login');
  }
});
// prevents error on hitting "back" after add
app.get('/addSafetyContact', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/user-info/');
  } else {
    res.redirect('/login');
  }
});

// add email // W *
app.post('/addEmail', function(req, res) {
  if (req.session.authenticated === true) {
    User.findOne({username: req.session.username })
    .then(function(user) {
      user.email = req.body.email1;
      console.log(user.email)
      user.save().then(function(user) {
        res.redirect('/user/' + user.username + '/user-info/');
      });
    }).catch(function(err) {
        res.send(err)
    });
  } else {
    res.redirect('/login')
  }
});
// prevents error on hitting "back" after add
app.get('/addEmail', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/user-info/');
  } else {
    res.redirect('/login');
  }
});
// add address // W *
app.post('/addAddress', function(req, res) {
  if (req.session.authenticated === true) {
    User.findOne({username: req.session.username })
    .then(function(user) {
      user.addlAddress = req.body.streetAddress + " " + req.body.addressLine2 + " " + req.body.inputCity + " " + req.body.inputState + " " + req.body.inputZip;
      user.addlAddressInfo = req.body.details;
      console.log(user.addlAddress, user.addlAddressInfo);
      user.save().then(function(user) {
        res.redirect('/user/' + user.username + '/user-info/');
      });
    }).catch(function(err) {
        res.send(err)
    });
  } else {
    res.redirect('/login');
  }
});
// prevents error on hitting "back" after add
app.get('/addAddress', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/user-info/');
  } else {
    res.redirect('/login');
  }
});

// USER LOGS--------------------------------------------------------------------
// view
app.get('/user/:username/logs/', function(req, res) {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.params.username })
    .then(function(user) {
      res.render('log', {logs: user.logs, username: req.params.username});
    });
  } else {
    res.redirect('/login');
  }
});
// add
app.post('/addLog', function(req,res) {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.session.username })
    .then(function(user) {
      user.logs.push({
        timestamp: new Date(),
        location: req.body.location,
        details: req.body.details,
        level_of_situation: req.body.level
      });
      user.save().then(function(user) {
        res.redirect('/user/' + user.username + '/logs/');
      });
    })
    .catch(function(err) {
      res.send(err)
    });
  };
});
// prevents error on hitting "back" after adding log
app.get('/addLog', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/logs/');
  } else {
    res.redirect('/login');
  }
});

app.get('/user/:username/logs/:id', function(req,res) {
if (req.session.authenticated === true) {
  User.findOne({username: req.params.username}).then(function(user) {
    res.render('solo-log', {log: user.logs.id(req.params.id) });
  });
} else {
  res.redirect('/login');
}
});

app.post('/user/:username/logs/:id', function(req,res) {
  User.findOne({username: req.params.username}).then(function(user) {
    const log = user.logs.id(req.params.id);
    log.details += req.body.newDetails;
    user.save().then(function(user) {
      res.redirect(req.get('referer'));
    });
  });
});

// ADMIN HOME-------------------------------------------------------------------
app.get('/admin', function(req, res) {
  User.find().then(function(users){
    res.render('admin-home', {users: users})
  })
});

app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("success: dom vio app up on port 5000");
});
