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

// built in passport parameter
// -----------------------------------------------------------------------------
  const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // backURL= req.header('Referer') || '/';
    res.redirect('/login');
    // res.redirect(backURL);
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

router.post('/card2login', function(req, res) {
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
      console.log("HAVING TROUBLES..")
      res.redirect('/login');
    }
  });

  router.get('/signup', isAuthenticated, function(req,res) {
      res.redirect('/user/' + req.user.username);
  });

  router.get('/user/:username', isAuthenticated, function(req, res) {
    res.render('user-home', { username: req.user.username, safety_contact: req.user.safety_contact[0]});
  });

// USER-INFORMATION (ROUTE '/user/user-info')-----------------------------------
router.get('/user/:username/user-info/', isAuthenticated, function(req, res) {
  res.render('user-information', {
        user: req.user,
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
// prevents error on hitting "back" after add
router.get('/addSafetyContact', isAuthenticated, function(req, res) {
  res.redirect('/user/' + req.user.username + '/user-info/');
});

// add email // W**
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
// // add
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

// add details
router.get('/user/:username/logs/:id', isAuthenticated, function(req, res) {
      res.render('solo-log', { log: req.user.logs.id(req.params.id) });
});

router.post('/user/:username/logs/:id', isAuthenticated, function(req,res) {
  User.findById(req.user.id, function (err, user) {
    if (err) return handleError(err);
    let log = user.logs.id(req.params.id);
    log.details += req.body.newDetails;
    user.save(function (err, user) {
      if (err) return handleError(err);
      res.redirect('/user/' + user.username + '/logs/');
    });
  });
});
//
// ADMIN HOME-------------------------------------------------------------------
router.get('/admin', function(req, res) {
  User.find().then(function(users){
    res.render('admin-home', {users: users})
  })
});

module.exports = router;
