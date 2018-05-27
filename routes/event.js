var express = require('express');
var db = require('../db/w_eventDb');
var router = express.Router();

router.post('/upload', function(req, res) {
    if(req.session.user) {
        db.eventUpload(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update', function(req, res) {
    if(req.session.user) {
        db.eventUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.eventDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user) {
        db.eventList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user) {
        res.redirect('/eventAdd.html');
    } else {
        res.redirect('/login.html');
    }
});

router.get('/update_page' ,function(req, res) {
    if(req.session.user) {
        db.eventUpdatePage(req, res);
    } else {
        res.redirect('/login.html');
    }
});

module.exports = router;