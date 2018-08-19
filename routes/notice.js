var express = require('express');
var db = require('../db/w_noticeDb');
var upload = require('./upload');
var router = express.Router();

router.post('/upload', upload.single('notice_picture'), function(req, res) {
    console.log(req);
    if(req.session.user) {
        db.noticeUpload(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update', upload.single('userfile'), function(req, res) {
    if(req.session.user) {
        db.noticeUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.noticeDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update_page' ,function(req, res) {
    if(req.session.user) {
        db.noticeUpdatePage(req, res);
    } else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user) {
        db.noticeList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user) {
        res.redirect('/noticeAdd.html');
    } else {
        res.redirect('/login.html');
    }
});

module.exports = router;