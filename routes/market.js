var express = require('express');
var db = require('../db/w_marketDb');
var router = express.Router();

router.post('/update', function(req, res) {
    if(req.session.user) {
        db.marketUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user) {
        db.marketDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user) {
        db.marketList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;
