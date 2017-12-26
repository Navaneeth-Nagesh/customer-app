const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const expressLayouts = require('express-ejs-layouts');
const expressValidator = require('express-validator');
const db = mongojs('customerapp', ['employee_data']);
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const router = express.Router();
var ObjectId = mongojs.ObjectId;

mongoose.connect(config.database);
let mon_db = mongoose.connection;
var app = express();


//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// set express layouts
app.use(expressLayouts);

//checking connection mongoose to mongodb

mon_db.once('open', function () {
    console.log('connected to MongoDB');
});

// checking error 
mon_db.on('error', function (err) {
    console.log(err);
});

// Express session middleware
app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: true
}));


// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//global initialization of user
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

// views 
app.get('/', function (req, res) {
    res.render('index', {
        title: 'customerapp'
    });
});

app.get('/about', function (req, res) {
    res.render('about', {
        title: 'customerapp'
    });
});

app.get('/home', ensureAuthenticated, function (req, res) {
    db.employee_data.find(function (err, docs) {
        res.render('home', {
            title: 'customerapp',
            employee_data: docs
        });
    })
});



//employee data

app.post('/employee_data/add', function (req, res) {
    var newuser = {
        emp_first_name: req.body.emp_first_name,
        emp_last_name: req.body.emp_last_name,
        desination: req.body.desination,
        emp_email: req.body.emp_email,
        salary: req.body.salary,
        contact_number: req.body.contact_number,
        age: req.body.age,
        date_birth: req.body.date_birth,
        state: req.body.state,
        district: req.body.district,
        address: req.body.address,

    }
    db.employee_data.insert(newuser, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/home');
        req.flash('success', 'Employee data added to the table.');
    })
    console.log(newuser);
});

app.delete('/employee_data/delete/:id', function (req, res) {
    console.log(req.params.id);
    db.employee_data.remove({
        _id: ObjectId(req.params.id)
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/home');
    });
});

//routes

let users = require('./routes/users');
app.use('/users', users);

// running server at port 3000..

app.listen(3000, '0.0.0.0', function () {
    console.log('Listening to port:  ' + 3000);
});