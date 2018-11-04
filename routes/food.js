var express = require('express');
var db = require('../db/w_foodDb');
var router = express.Router();

router.post('/update', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update_page', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/sold_out', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/foodShop', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;
