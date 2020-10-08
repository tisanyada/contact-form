const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// passport config
require('./config/passport')(passport);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: 'hjkldwdsjlkjdskjooqwi8239091-20mwjhssl-12i*()m,2',
    resave: false,
    saveUninitialized: true
}));


// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/', require('./routes/user'));
app.use('/admin', require('./routes/admin'));


const dbUrl = 'mongodb://localhost:27017/socket';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        http.listen(3000, () => {
            console.log('\nconnected to db');
            console.log('server is running on port: ', 3000, '\n');
            io.on('connection', (socket) => {
                socket.on('contactmail', (mail) => {
                    socket.broadcast.emit('contactmail', mail);
                });
            });
        });
    }).catch(err => console.log(err));