const passport = require('passport');
const login = require('./login.js');
const signup = require('./signup.js');
const User = require('../models/User.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log('serializing user:', user);
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    login(passport);
    signup(passport);

}
