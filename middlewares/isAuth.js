const Admin = require("../models/Admin");
const User = require("../models/User");



module.exports = {
    isAUTH: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'please login to view this info');
        res.redirect('/');
    },
    isAdminAUTH: (req, res, next) => {
        if (req.isAuthenticated()) {
            User.findById(req.user._id)
                .then(user => {
                    if (user.role === 'admin') {
                        return next();
                    }
                    req.flash('error', 'sorry, only registered admin\'s can access this section');
                    return res.redirect('/admin/login');
                }).catch(err => console.log(err));
        } else {
            req.flash('error', 'please login to view this item');
            return res.redirect('/admin/login');
        }
    }
}