var express = require('express');
var db = require('../db/w_userDb');
var router = express.Router();

router.post('/update', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.userUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.userDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.userList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;
