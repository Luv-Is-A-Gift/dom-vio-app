const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.resolve(__dirname, 'public');

var app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'dom vio', cookie: { maxAge: 300000 }}));

app.get('/', function(req, res) {
  req.session.authenticated = false;
  res.render('home');
});

app.get('/admin', function(req, res) {
  if (req.session.authenticated === true) {
    res.render('admin')
  } else {
    res.redirect('/');
  }
});

app.get('/signup', function(req, res) {
    res.render('signup')
});

app.get('/log', function(req, res) {
  if (req.session.authenticated === true) {
    res.render('log')
  } else {
    res.redirect('/');
  }
});










app.listen(process.env.PORT || 5000, function(req, res) {
  console.log("success: dom vio app up on port 5000");
});





// *** intentional whitespace ***
