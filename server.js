var express = require('express');
const ejs = require('ejs');
const firebase = require('./firebase/firebase');


var app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//app.listen(8080, '10.0.0.62');
app.listen(8080);




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
    res.json({"message": "ok"});
});

app.post('/firebase/visit', async function(req, res){
    firebase.updateVisits();
    console.log("Someone viited")
    res.json({"message": "ok"});
});

app.post('/firebase/quote', function(req, res){

});