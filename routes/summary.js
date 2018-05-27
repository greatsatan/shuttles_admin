var express = require('express');
var db = require('../db/w_summaryDb');
var router = express.Router();

router.get('/', function(req, res){ 
    if(req.session.user) {
        db.summary(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;