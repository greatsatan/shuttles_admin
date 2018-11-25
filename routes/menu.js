var express = require('express');
var fs = require('fs');
var upload = require('./upload');
var db = require('../db/w_coffeeDb');
var router = express.Router();

router.post('/upload', upload.single('userfile'), function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeUpload(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update', upload.single('userfile'), function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update_page' ,function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeUpdatePage(req, res);
    } else {
        res.redirect('/login.html');
    }
});

router.post('/delete', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeDelete(req, res);   
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/sold_out', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeSoldOut(req, res);   
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/coffeeShop', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeShop(req, res);   
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.coffeeList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        res.redirect('/menuAdd.html');
    } else {
        res.redirect('/login.html');
    }
});

module.exports = router;
