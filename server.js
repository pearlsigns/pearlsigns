const express = require('express');
require('dotenv').config()
const ejs = require('ejs');
const firebase = require('./firebase/firebase');
const tw = require('./twilio/twilio');
const PORT = process.env.PORT || 8080;

var app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

var favicon = require('serve-favicon');
const { Twilio } = require('twilio');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.listen(PORT)
console.log("App started on "+ PORT)
//app.listen(8080);



// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/index', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    res.render('pages/about');
});

app.get('/services', function (req, res) {
    res.render('pages/services');
});

app.get('/contact', function (req, res) {
    res.render('pages/contact');
});

app.get('/project', function (req, res) {
    res.render('pages/project');
});

app.get('/auth', function (req, res) {
    res.render('pages/auth');
});

app.post('/firebase/auth', function(req, res){
    firebase.signInUser(req.body.uname, req.body.pword).then((uid) => {
        res.json({"user": uid});    })
});

app.post('/firebase/visit', async function(req, res){
    firebase.updateVisits();
    res.json({"message": "ok"});
});

app.post('/firebase/quote', function(req, res){
    firebase.requestQuote(req.body.name, req.body.phone, req.body.service, req.body.message)
    const messagebuilder = "From: " + req.body.name + "\nContact: " + req.body.phone + "\nSubject: " + req.body.service + "\nMessage: " + req.body.message;  
    tw.sendMessage(messagebuilder);
    res.json({"message":"ok"});
});

app.post('/firebase/requests', function(req, res){
    firebase.fetchData().then((snapshot) => {
        res.json(snapshot);
    })
});

app.get('/firebase/data', function(req, res){
        res.render('./pages/data');
});

