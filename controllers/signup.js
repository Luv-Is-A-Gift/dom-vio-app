const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/User.js');
const bCrypt = require('bcryptjs');

module.exports = function(passport) {

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function() {
                User.findOne({ username :  username }, function(err, user) {
                    if (err) {
                        console.log('Error in SignUp:', err);
                        return done(err);
                    }
                    if (user) {
                        console.log('User already exists with username:', username);
                        return done(null, false);
                    } else {
                        const newUser = new User(
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
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user:', err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // cb
            process.nextTick(findOrCreateUser);
        })
    );


}
