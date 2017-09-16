const express = require('express');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const adminRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Admin = require('../models/Admin.js');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');


  // ADMIN PROMPT/ START----------------------------------------------------------
  // NOTE: // providing id param > /admin/:id will render the login form.
adminRouter.get('/admin', function(req, res) {
  res.send('Enter valid id as a second parameter to continue.');
});

adminRouter.get('/admin/login', function (req, res) {
  // res.send('NO');
  res.redirect('/admin');
});


// ADMIN SIGNUP-----------------------------------------------------------------
// NOTE: admin signup can be accessed openly right now. idea : make this a "register new admin" only on tashia's admin-home?
adminRouter.get('/admin/signup', function(req, res) {
  res.render('admin-signup');
  // res.redirect('/admin');
});

adminRouter.post('/admin/signup', function(req, res) {
  const newAdmin = new Admin(
      {
        adminFirstname: req.body.firstname,
        adminLastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password1,
      },

    );
    newAdmin.save(function(err, admin) {
       if (err) {
         console.log("Oh no! Error: ", err);
         res.redirect('/admin');
       }
       console.log("Admin Added! Go check mlab!", admin);
       res.redirect('/admin/login');
    });
})



  // ADMIN LOGIN------------------------------------------------------------------
  // NOTE: providing valid id in the parameters is necessary before even viewing login form...
  // for added layer of 'security'...
adminRouter.get('/admin/:adminId', function(req, res) {
  Admin.findById(req.params.adminId, function(err, admin) {
    if(err) {
      return console.log(err);
    }
    if(admin) {
      res.render('admin-access', { id: admin.id });
    }
    if(!admin) {
      res.redirect('/admin');
    }
  });
});

  adminRouter.post('/admin/:adminId', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
   Admin.findOne({ username: username }, function(err, admin) {
     if (admin && bcrypt.compareSync(password, admin.password)) {
        console.log('YOU SHALL PASS: ' + admin);
        req.session.adminId = admin.id;
        req.session.authenticated = true;
        // return req.session;
				res.redirect('/admin/' + admin.id + '/adminhome')
     } else {
       req.session.authenticated = false;
			 res.redirect('/admin');
		 }
   });
});

  // ADMIN HOME-----------------------------------------------------------------
  adminRouter.get('/admin/:adminId/adminhome', function(req, res) {
      if (req.session && req.session.authenticated) {
        console.log("grabbing users for admin");
        User.find().then(function(users) {
          res.render('admin-home', { users: users, adminId: req.session.adminId });
        });
      } else {
        res.redirect('/');
      }
  });

  adminRouter.get('/admin/:adminId/:userId', function (req, res) {
    if (req.session && req.session.authenticated) {
      User.findById(req.params.userId, function (err, user) {
        if (err) {
          return console.log('ERROR LOADING USER', err);
        }
        res.render('admin-view-user', {
          user: user,
          safety_contact: user.safety_contact,
          logs: user.logs
        });
      });

    } else {
      res.redirect('/');
    };
  });


  module.exports = adminRouter;
