var express = require('express');
const ejs = require('ejs');
const firebase = require('./firebase/firebase');
const router = express.Router();

var app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//app.listen(8080, '10.0.0.62');
//app.listen(8080);

app.use("/.netlify/functions/app", router);


// *** GET Routes - display pages ***
// Root Route
router.get('/', function (req, res) {
    res.render('pages/index');
});

router.get('/index', function (req, res) {
    res.render('pages/index');
});

router.get('/about', function (req, res) {
    res.render('pages/about');
});

router.get('/services', function (req, res) {
    res.render('pages/services');
});

router.get('/contact', function (req, res) {
    res.render('pages/contact');
});

router.get('/project', function (req, res) {
    res.render('pages/project');
});

router.get('/auth', function (req, res) {
    res.render('pages/auth');
});

router.post('/firebase/auth', function(req, res){
    res.json({"message": "ok"});
});

router.post('/firebase/visit', async function(req, res){
    firebase.updateVisits();
    console.log("Someone viited")
    res.json({"message": "ok"});
});

router.post('/firebase/quote', function(req, res){
    
});

module.exports.handler = serverless(app);