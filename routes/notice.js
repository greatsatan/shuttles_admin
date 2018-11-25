var express = require('express');
var db = require('../db/w_noticeDb');
var upload = require('./upload');
var router = express.Router();

router.post('/upload', upload.single('notice_picture'), function(req, res) {
    if(req.session.user) {
        db.noticeUpload(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update', upload.single('notice_picture'), function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.noticeUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.noticeDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update_page' ,function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.noticeUpdatePage(req, res);
    } else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.noticeList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        res.redirect('/noticeAdd.html');
    } else {
        res.redirect('/login.html');
    }
});

module.exports = router;
