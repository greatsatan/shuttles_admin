var express = require('express');
var db = require('../db/w_summaryDb');
var router = express.Router();

router.get('/', function(req, res){ 
    if(req.session.user && req.session.user.m_id == 0) {
        db.summary(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;