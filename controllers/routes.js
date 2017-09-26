const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/User.js');
const bCrypt = require('bcryptjs');
const fetch = require('node-fetch');
const multer  = require('multer')

// PASSPORT AUTH----------------------------------------------------------------
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect('/');
}

//FILE STORAGE-------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// *** OLD *** MASK-------------------------------------------------------------------------
// router.get('/', function(req, res) {
//   req.user = false;
//   req.session = false;
//   res.render('cards');
// });
//
// router.post('/shuffle', function(req, res) {
//   fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
//   .then(function(response){
//     return response.json();
//   })
//   .then(function(json) {
//     if (json.shuffled === true) {
//     console.log(json);
//     req.session.deckId = json.deck_id;
//     };
//   res.render('cards', {results:json});
//   });
// });
//
// router.post('/drawCard', function(req, res) {
//   fetch('https://deckofcardsapi.com/api/deck/' + req.session.deckId + '/draw/?count=1')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(json){
//     res.render('cards', {cardResults:json})
//     console.log("prints drawCard json", json);
//   });
// });
//
// router.post('/card2login', function(req, res) {
//   res.render('login-signup');
// });

// *** NEW MASK, NEWSFEED *** --------------------------------------------------
router.get('/', function(req, res) {
  res.render('news');
});

router.post('/showNews', function(req, res) {
  fetch('https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=ae688101a463441f98b90bb617290485')
  .then(function(response){
    return response.json();
  })
  .then(function(json) {
  res.render('news', {news:json});
  });
});

router.post('/toGame', function(req, res) {
  res.render('login-signup');
});

//USER LOGIN--------------------------------------------------------------------
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
router.post('/signup', function(req, res) {
  var newUser = new User(
      {
        dateOfBirth: req.body.dob,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password1,
        phone_number: req.body.phone,
        homeAddress: req.body.streetAddress + " "
        + req.body.addressLine2 + " "
        + req.body.inputCity + " "
        + req.body.inputState + " "
        + req.body.inputZip,
        homeAddressInfo: req.body.details,
      }
    );
    newUser.save(function(err, user) {
       if (err) {
         console.log("Oh no! Error: ", err);
         res.redirect('/login');
       }
       console.log("User Added! Go check mlab!", user);
       res.redirect('/login');
    });
});
// prevents error on hitting "back" after signup
router.get('/signup', isAuthenticated, function(req,res) {
    res.redirect('/user/' + req.user.username);
});

// USER-HOME--------------------------------------------------------------------
router.get('/user/:username', isAuthenticated, function(req, res) {
  res.render('user-home', {
    username: req.user.username,
    firstname: req.user.firstname,
    safety_contact: req.user.safety_contact[0]});
});

// USER-INFORMATION-------------------------------------------------------------
router.get('/user/:username/user-info/', isAuthenticated, function(req, res) {
  res.render('user-information', {
        user: req.user,
        username: req.user.username,
        safety_contact: req.user.safety_contact
      });
});

// add safety contact
router.post('/addSafetyContact', isAuthenticated, function(req, res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return handleError(err);
    user.safety_contact.push({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      relationshipToUser: req.body.relationship,
      email: req.body.email,
      phone_number: req.body.phone,
    });
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect('/user/' + user.username + '/user-info');
    });
  });
});

// add oppressor information
router.post('/oppressorInfo', isAuthenticated, upload.any(), function(req, res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return handleError(err);
    var path = req.files[0].path;
    var imageName = req.files[0].originalname;
    var imagepath = {};
    imagepath['path'] = path;
    imagepath['originalname'] = imageName;

    user.oppressor_information.push({
      nameOfAbuser: req.body.nameOfAbuser,
      abuserInfo: req.body.abuserInfo,
    });
    user.abuserPic.push({
      path: req.files[0].path,
      originalname: req.files[0].originalname
    });

    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect('/user/' + user.username + '/user-info');
    });
  });
});



// prevents error on hitting "back" after add
router.get('/addSafetyContact', isAuthenticated, function(req, res) {
  res.redirect('/user/' + req.user.username + '/user-info/');
});

// add email
router.post('/addEmail', isAuthenticated, function(req, res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return handleError(err);
    user.set({ email: req.body.email1 });
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect('/user/' + user.username + '/user-info');
    });
  });
});
// prevents error on hitting "back" after add
router.get('/addEmail', isAuthenticated, function(req, res) {
  res.redirect('/user/' + req.user.username + '/user-info/');
});

// add addl address
router.post('/addAddress', isAuthenticated, function(req, res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return handleError(err);
    user.set({
      addlAddress: req.body.streetAddress + " "
      + req.body.addressLine2 + " "
      + req.body.inputCity + " "
      + req.body.inputState + " "
      + req.body.inputZip,
      addlAddressInfo: req.body.details
    });
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect('/user/' + user.username + '/user-info');
    });
  });
});
// prevents error on hitting "back" after add
router.get('/addAddress', isAuthenticated, function(req, res) {
  res.redirect('/user/' + req.user.username + '/user-info/');
});

// USER LOGS--------------------------------------------------------------------
// view
router.get('/user/:username/logs/', isAuthenticated, function(req, res) {
    res.render('log', { logs: req.user.logs, username: req.user.username });
});

// CREATE NEW LOG
router.post('/addLog', isAuthenticated, function(req, res) {
    User.findById(req.user.id, function (err, user) {
      if (err) return handleError(err);
      user.logs.push({
        timestamp: new Date(),
        location: req.body.location,
        details: req.body.details,
        level_of_situation: req.body.level
      });
      user.save(function (err, user) {
        if (err) return handleError(err);
        res.redirect('/user/' + user.username + '/logs/');
      });
    });
});
// prevents error on hitting "back" after adding log
router.get('/addLog', isAuthenticated, function(req, res) {
  res.redirect('/user/' + req.user.username + '/logs/');
});

// ADD DETAILS TO NEW LOG
router.post('/user/:username/logs/:id', isAuthenticated, function(req,res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return handleError(err);
    let log = user.logs.id(req.params.id);
    log.details += " " + req.body.newDetails;
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect('/user/' + user.username + '/logs/');
    });
  });
});
// prevents error on hitting "back" after adding details
router.get('/user/:username/logs/:id', isAuthenticated, function(req, res) {
      res.redirect('/user/' + req.user.username + '/logs/')
});


module.exports = router;
