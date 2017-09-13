const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/User.js');
const bCrypt = require('bcryptjs');

// built in passport parameter
// -----------------------------------------------------------------------------
  const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // res.redirect('/login')
    res.redirect('back');
  }
// -----------------------------------------------------------------------------

router.get('/', function(req, res) {
  // req.session.authenticated = false;
  res.render('cards');
});

router.post('/shuffle', function(req, res) {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  .then(function(response){
    return response.json();
  })
  .then(function(json) {
    if (json.shuffled === true) {
    console.log(json);
    req.session.deckId = json.deck_id;
    };
  res.render('cards', {results:json});
  });
});

router.post('/drawCard', function(req, res) {
  fetch('https://deckofcardsapi.com/api/deck/' + req.session.deckId + '/draw/?count=1')
  .then(function(response) {
    return response.json();
  })
  .then(function(json){
    res.render('cards', {cardResults:json})
    console.log("prints drawCard json", json);
  });
});

router.post('/card2login', isAuthenticated, function(req, res) {
  res.render('login-signup');
});


  router.get('/login', function (req, res) {
    res.render('login-signup');
  });

  router.post('/login', passport.authenticate('login'), function(req, res) {
    if (req.user) {
      res.redirect('/user/' + req.user.username)
    } else {
      res.redirect('/login');
    }
  });

  //USER SIGNUP-------------------------------------------------------------------
  router.post('/signup', passport.authenticate('signup'), function(req, res) {
    if (newUser) {
      // send success + please login message
      console.log(newUser);
      res.redirect('/login');
    } else {
      res.redirect('/login');
    }
  });

  router.get('/signup', isAuthenticated, function(req,res) {
      res.redirect('/user/' + req.session.username);
  });

  router.get('/user/:username', isAuthenticated, function(req, res) {
    res.render('user-home', { username: req.user.username});
  });

// USER-INFORMATION (ROUTE '/user/user-info')-----------------------------------
router.get('/user/:username/user-info/', isAuthenticated, function(req, res) {
  res.render('user-information', {
        user: req.user,
        safety_contact: req.user.safety_contact
      });
});

// add safety contact // W *
router.post('/addSafetyContact', isAuthenticated, function(req, res) {
    User.findOne({ id: req.user.id })
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
});
// prevents error on hitting "back" after adrouter.get('/addSafetyContact', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/user-info/');
  } else {
    res.redirect('/login');
  }
});

// add email // W *
router.post('/addEmail', function(req, res) {
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
router.get('/addEmail', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/user-info/');
  } else {
    res.redirect('/login');
  }
});
// add address // W *
router.post('/addAddress', function(req, res) {
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
router.get('/addAddress', function(req,res) {
  if (req.session.authenticated === true) {
      res.redirect('/user/' + req.session.username + '/user-info/');
  } else {
    res.redirect('/login');
  }
});

// USER LOGS--------------------------------------------------------------------
// view
router.get('/user/:username/logs/', function(req, res) {
  if (req.session.authenticated === true) {
    User.findOne({ username: req.params.username })
    .then(function(user) {
      res.render('log', {logs: user.logs, username: req.params.username});
    });
  } else {
    res.redirect('/login');
  }
});
// // add
// router.post('/addLog', function(req,res) {
//   if (req.session.authenticated === true) {
//     User.findOne({ username: req.session.username })
//     .then(function(user) {
//       user.logs.push({
//         timestamp: new Date(),
//         location: req.body.location,
//         details: req.body.details,
//         level_of_situation: req.body.level
//       });
//       user.save().then(function(user) {
//         res.redirect('/user/' + user.username + '/logs/');
//       });
//     })
//     .catch(function(err) {
//       res.send(err)
//     });
//   };
// });
// // prevents error on hitting "back" after adding log
// router.get('/addLog', function(req,res) {
//   if (req.session.authenticated === true) {
//       res.redirect('/user/' + req.session.username + '/logs/');
//   } else {
//     res.redirect('/login');
//   }
// });
//
// router.get('/user/:username/logs/:id', function(req,res) {
// if (req.session.authenticated === true) {
//   User.findOne({username: req.params.username}).then(function(user) {
//     res.render('solo-log', {log: user.logs.id(req.params.id) });
//   });
// } else {
//   res.redirect('/login');
// }
// });
//
// router.post('/user/:username/logs/:id', function(req,res) {
//   User.findOne({username: req.params.username}).then(function(user) {
//     const log = user.logs.id(req.params.id);
//     log.details += req.body.newDetails;
//     user.save().then(function(user) {
//       res.redirect(req.get('referer'));
//     });
//   });
// });
//
// // ADMIN HOME-------------------------------------------------------------------
// router.get('/admin', function(req, res) {
//   User.find().then(function(users){
//     res.render('admin-home', {users: users})
//   })
// });

module.exports = router;
