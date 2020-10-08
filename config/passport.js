const User = require("../models/User");
const Admin = require('../models/Admin');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


module.exports = (passport) => {
    passport.use('user', new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        User.findOne({ 'username': username })
            .then(user => {
                if (!user) return done(null, false, { message: 'user is not registered' });
                // match pasword
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'incorrect password' });
                    }
                });
            }).catch(err => console.log(err));
    }));

    passport.use('admin', new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        Admin.findOne({ 'username': username })
            .then(user => {
                if (!user) return done(null, false, { message: 'user is not registered' });
                // match pasword
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'incorrect password' });
                    }
                });
            }).catch(err => console.log(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}