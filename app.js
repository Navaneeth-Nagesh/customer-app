const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users']);
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
/*const session = require('express-session');*/

var ObjectId = mongojs.ObjectId;

mongoose.connect('mongodb://localhost/customerapp');
let mon_db = mongoose.connection;

var app = express();


//console
/*var logger = function(req,res,next){
    console.log('yo');
    next();
}
app.use(logger);*/

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

// Express session middleware

// trust first proxy
/*
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
*/

//express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//express validator middleware

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



let users = require('./routes/users');
app.use('/users', users);

/*app.use(session);*/

//checking connection mongoose to mongodb

mon_db.once('open', function () {
    console.log('connected to MongoDB');
});

// checking error 
mon_db.on('error', function (err) {
    console.log(err);
});

// views 
app.get('/', function (req, res) {
    res.render('index', {
        title: 'customer'
    });
});
app.get('/register', function (req, res) {
    db.users.find(function (err, docs) {
        //console.log(docs);
        res.render('register', {
            title: 'customer',
            users: docs
        });
    })
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/home', function (req, res) {
    db.employee_data.find(function (err, docs) {
        res.render('home', {
            title: 'customer',
            employee_data: docs
        });
    })
});

//employee data

app.post('/employee_data/add', function (req, res) {
    var newuser = {
        emp_first_name: req.body.emp_first_name,
        emp_last_name: req.body.emp_last_name,
        desination: req.body.designation,
        emp_email: req.body.emp_email,
        salary: req.body.salary,
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

// running server at port 3000..

app.listen(3000, function () {
    console.log("server started");
})