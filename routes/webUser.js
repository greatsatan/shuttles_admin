var express = require('express');
var db = require('../db/w_webUserDb');
var router = express.Router();

router.post('/update', function(req, res) {
    if(req.session.user) {
        db.webUserUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.webUserDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user) {
        db.webUserList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;
