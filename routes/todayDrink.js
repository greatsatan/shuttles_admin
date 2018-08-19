var express = require('express');
var db = require('../db/w_todayDrinkDb');
var router = express.Router();
var upload = require('./upload');

router.get('/list', function(req, res){ 
    if(req.session.user) {
        db.todayDrinkList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user) {
        db.todayDrinkAdd(req, res);
    } else {
        res.redirect('/login.html');
    }
});

router.post('/update', upload.single('userfile'), function(req, res) {
    if(req.session.user) {
        db.todayDrinkUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.todayDrinkDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update_page' ,function(req, res) {
    if(req.session.user) {
        db.todayDrinkUpdatePage(req, res);
    } else {
        res.redirect('/login.html');
    }
});

module.exports = router;