const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const Admin = require('../models/Admin.js');
const bCrypt = require('bcryptjs');

module.exports = function(passport) {

	passport.use('adminLogin', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, id, username, password, done) {
            Admin.findById({ id : id },
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        console.log('Admin not found with the id:', id);
                        return done(null, false);
                    }
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false);
                    }
                    if (username != user.username) {
                      console.log('Invalid Username');
                    }
                    console.log("ADMIN HAS BEEN AUTHORIZED:", user)
                    return done(null, user);
                }
            );

        })
    );


    const isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

}
