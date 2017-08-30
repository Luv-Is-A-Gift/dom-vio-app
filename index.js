const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.resolve(__dirname, 'public');
const data = require('./data.js');

const adminData = data.adminData;
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

//TEMP AUTH. Drag this into sep js------------------------------------
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

// NOTE: failed attempts at user + admin auth combined. will delete. saving for ref.
// NOTE: edit ^: res redirects were the error / issue. can try combined again later
// function authenticate(req, username, password) {
//    console.log('authenticating');
//    var authenticatedUser = userData.find(function (user) {
//     if (username === user.username && password === user.password) {
//       console.log('User & Password Pass Authentication!')
//       return req.session = {authenticated: true, user: true};
//     } else {
//       return req.session = {autheticated: false, user: false};
//      }
//    })
//    var authenticatedAdmin = adminData.find(function(user) {
//      if (username === user.adminUsername && password === user.adminPassword) {
//        console.log('Admin has been authenticated');
//        return req.session = {authenticated: true, user: false};
//      } else {
//        console.log('Unauthorized!')
//        return req.session = {authenticated: false, user: false};
//      }
//    })
//    console.log(req.session);
//    return req.session;
// }
// function authenticate(req, username, password) {
//   userData.find(function (user) {
//       if (username === user.username && password === user.password) {
//         console.log('User & Password Pass Authentication!')
//         return req.session = {authenticated: true, user: true};
//       } else {
//         return;
//       }
//     return req.session
//   })
//   adminData.find(function(admin) {
//       if (username === admin.adminUsername && password === admin.adminPassword) {
//         return req.session = {authenticated: true, admin: true};
//       } else {
//         return;
//       }
//       return req.session
//   })
//    console.log(req.session)
//    return req.session;
// };

// ROUTES--------------------------------------------------------------
app.get('/', function(req, res) {
  req.session.authenticated = false;
  res.render('login-signup');
});


app.post('/login', function (req, res) {
    let username = req.body.loginName;
    let password = req.body.loginPassword;
    authenticate(req, username, password);
    if (req.session && req.session.authenticated) {
      console.log('user authenticated!')
      req.session.user = username;
      res.redirect('/user');
      // res.render('user-home', {username: username})
    } else {
      //NOTE: We discussed having incorrect user login information lead you to a game / "under construction" page for now (for cover).
      // This can be added later.
      console.log('Invalid login information, try again please.')
      res.render('login')
    };
});

app.get('/user', function(req, res) {
  res.render('user-home', {username: req.session.user})
});

app.get('/admin', function(req, res) {
  res.render('admin-home', {
    // username: adminUsername,
    userData
  })
});

// -----------------------------------------------------------------------------
// NOTE: *********08/29/2017**********
// --when sign-up is submitted: user added to db + sent back to login
// --personal-information form should be optional...can have disclaimer that adding information to have on file is necessary to help/ use all of app's features
// user-home page will have button to trigger user-information view (page or dynamic component render...team can discuss.)
// sign up currently includes first name, last name, username, email, password

app.post('/signup', function(req, res) {
  // let user = {
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  //   username: req.body.username,
  //   password: req.body.password1,
  //   email: req.body.email1
  // };
  // function addUser(user, userData) {
  //   userData.push(user);
  //   return userData;
  // }
  res.render('login-signup');
});

app.get('/user-information', function(req, res) {
  res.render('user-information');
})

// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("success: dom vio app up on port 5000");
});




// *** intentional whitespace ***
