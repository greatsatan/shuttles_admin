var express = require('express');
var db = require('../db/w_todayDrinkDb');
var router = express.Router();

router.get('/list', function(req, res){ 
    if(req.session.user && req.session.user.m_id == 0) {
        db.todayDrinkList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/add', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.todayDrinkAdd(req, res);
    } else {
        res.redirect('/login.html');
    }
});

router.post('/update', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.todayDrinkUpdate(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user && req.session.user.m_id == 0) {
        db.todayDrinkDelete(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;