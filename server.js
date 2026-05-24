const express = require('express');
require('dotenv').config()
const ejs = require('ejs');
const firebase = require('./firebase/firebase');
const email = require('./firebase/sendEmail')
const PORT = process.env.PORT || 8080;

var app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.listen(PORT)
console.log("App started on " + PORT)
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

app.get('/careers', async function (req, res) {
    try {
        const jobsList = await firebase.getCareers();
        res.render('pages/careers', { jobs: jobsList });
    } catch (error) {
        console.error("Error loading careers, showing fallback state:", error);
        res.render('pages/careers', { jobs: [] });
    }
});
app.get('/api/careers/list', async function (req, res) {
    try {
        const jobsList = await firebase.getCareers();
        res.json({ jobs: jobsList });
    } catch (error) {
        console.error("Error loading careers, showing fallback state:", error);
        res.status(500).json({ error: "Failed to create job post" });
    }
});

app.post('/api/careers/create', async function (req, res) {
    try {
        const { title, description, status } = req.body;
        await firebase.createCareer(title, description, status);
        res.json({ message: "Job posted successfully!" });
    } catch (error) {
        console.error("Route error creating career:", error);
        res.status(500).json({ error: "Failed to create job post" });
    }
});

// Route to update a job post
app.post('/api/careers/update', async function (req, res) {
    try {
        const { id, title, description, status } = req.body;
        await firebase.updateCareer(id, title, description, status);
        res.json({ message: "Job updated successfully!" });
    } catch (error) {
        console.error("Route error updating career:", error);
        res.status(500).json({ error: "Failed to update job post" });
    }
});

// Route to delete a job post
app.post('/api/careers/delete', async function (req, res) {
    try {
        const { id } = req.body;
        await firebase.deleteCareer(id);
        res.json({ message: "Job deleted successfully!" });
    } catch (error) {
        console.error("Route error deleting career:", error);
        res.status(500).json({ error: "Failed to delete job post" });
    }
});


app.get('/auth', function (req, res) {
    res.render('pages/auth');
});

app.post('/firebase/auth', function (req, res) {
    firebase.signInUser(req.body.uname, req.body.pword).then((uid) => {
        res.json({ "user": uid });
    })
});

app.post('/firebase/visit', async function (req, res) {
    //firebase.updateVisits();
    res.json({ "message": "ok" });
});

app.post('/firebase/quote', function (req, res) {
    firebase.requestQuote(req.body.name, req.body.phone, req.body.service, req.body.message)
    const messagebuilder = "From: " + req.body.name + "\nContact: " + req.body.phone + "\nSubject: " + req.body.service + "\nMessage: " + req.body.message;
    tw.sendMessage(messagebuilder);

    res.json({ "message": "ok" });
});

app.post('/firebase/requests', function (req, res) {
    firebase.fetchData().then((snapshot) => {
        res.json(snapshot);
    })
});

app.get('/firebase/data', function (req, res) {
    res.render('./pages/data');
});

