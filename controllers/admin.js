const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


exports.getIndex = (req, res) => {
    res.render('admin/index');
}


exports.getRegister = (req, res) => {
    res.render('admin/register');
}


exports.createAdmin = (req, res) => {
    let errors = [];
    const { username, email, password, password2 } = req.body;
    // checking if all fields are null
    if (!username) {
        errors.push({ msg: 'Username field is required!' });
    }
    if (!email) {
        errors.push({ msg: 'Email field is required!' });
    }

    if (!password) {
        errors.push({ msg: 'Password field is required' });
    }

    if (!password2) {
        errors.push({ msg: 'Confirm password field is required' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('admin/register', {
            errors
        });
    } else {
        User.findOne({ 'username': username })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'username is already registered' });
                    res.render('register', {
                        errors
                    });
                } else {
                    bcrypt.hash(password, 12)
                        .then(hashedPassword => {
                            new User({
                                username,
                                email,
                                password: hashedPassword,
                                role: 'admin'
                            }).save()
                                .then(() => {
                                    req.flash('success_msg', 'success!, proceed to login');
                                    res.redirect('/admin/login');
                                }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
    }
}



exports.login = (req, res, next) => {
    passport.authenticate('user', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
}


exports.getDashboard = (req, res) => {
    res.render('admin/dashboard',{
        user: req.user
    });
}