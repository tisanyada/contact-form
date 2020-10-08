const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');


exports.getIndex = (req, res) => {
    res.render('index');
}


exports.getRegister = (req, res) => {
    res.render('register');
}


exports.createUser = (req, res) => {
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
        res.render('register', {
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
                                role: 'user'
                            }).save()
                                .then(() => {
                                    req.flash('success_msg', 'success!, proceed to login');
                                    res.redirect('/');
                                }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
    }
}



exports.login = (req, res, next) => {
    passport.authenticate('user', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
}


exports.getDashboard = (req, res) => {
    res.render('dashboard');
}


exports.sendMail = (req, res) => {
    let errors = [];
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        errors.push({ msg: 'all fields are required to send this mail' });
    }

    if (errors.length > 0) {
        res.render('dashboard', {
            errors
        });
    } else {
        const smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tysanyada@gmail.com',
                pass: 'Martins2906'
            }
        });

        const mailOptions = {
            to: 'tysanyada@gmail.com',
            from: 'tysanyada@gmail.com',
            subject: subject,
            text: email + ': says ' + message
        };

        smtpTransport.sendMail(mailOptions, (err) => {
            if (err) {
                console.log(err);
                req.flash('error', 'an error occured while sending your contact mail');
                return res.redirect('/dashboard');
            }
            console.log('success');
            req.flash('success_msg', 'contact mail sent successfully');
            res.redirect('/dashboard');
        });
    }

}