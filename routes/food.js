var express = require('express');
var db = require('../db/w_foodDb');
var router = express.Router();

router.get('/list', function(req, res) {
    if(req.session.user) {
        db.foodList(req, res);
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;
