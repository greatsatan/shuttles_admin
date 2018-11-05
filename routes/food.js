var express = require('express');
var db = require('../db/w_foodDb');
var router = express.Router();
var upload = require('./upload');

router.post('/upload', upload.single('userfile'), function(req, res) {
    if(req.session.user) {
        db.foodUpload(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update', upload.single('userfile'), function(req, res) {
    if(req.session.user) {
        db.foodUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.foodDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update_page', function(req, res) {
    if(req.session.user) {
        db.foodUpdatePage(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/sold_out', function(req, res) {
    if(req.session.user) {
        db.foodSoldout(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/foodShop', function(req, res) {
    if(req.session.user) {
        db.foodShop(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user) {
        res.redirect('/foodAdd.html');
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
